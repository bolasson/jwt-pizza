# Curiosity Report: Quality Assurance and Automated Testing in Game Development

## Introduction
Over the course of the semester I've wondered what DevOps looks like in game design, since it's one of my hobbies and there's a lot of toil with my current development approach, specifically manual playtesting. So, I researched how to apply automated  principles to Unity development. I built a basic game using a Third Person Character Controller playground (the game design equivalent of the base JWT pizza), implemented automated Play Mode tests, and learned how to seperate the build process from the testing process to integrate into a CI/CD pipeline for games. The whole system uses the Unity Test Framework.

## What is the Unity Test Framework?
The Unity Test Framework (UTF) is the standard testing solution for Unity. Under the hood, it integrates **NUnit**, a well known .NET testing library that functions similary to Playwright and Jest.

UTF offers two different modes:
1.  **Edit Mode Tests:** run instantly in the Unity Editor. These are great for testing logic that doesn't require the game engine to be running. Some examples include mathematical calculations, inventory logic, and a proper game manager setup. This is very close to Jest.
2.  **Play Mode Tests:** run at runtime. These allow you to spawn characters, simulate physics, and simulate inputs over time using Coroutines. This has some similarity to Playwright, but the frame control actually is significantly more accuracy because it accomadates for slow and fast connections, runtime speeds, and user input.

The hardest part about working with UTF is setting up Assembly defintion files **(`.asmdef`)**. When games are developed, a full build is created which is very time consuming and process intensive. And as we talked about in class, the longer tests take, the less likely they are to be run frequently. The full build assembly is called `Assembly-CSharp.dll`. While its convenient for small projects, it's a nightmare for DevOps and Testing for the following reasons:
* **Compilation:** Changing one script recompiles everything, and requires a new build for testing and production.
* **Dependency:** Everything can access everything else, leading to spaghetti code (which I've struggled with in previous projects).
* **Testing Isolation:** Your test scripts cannot easily reference your game scripts if the game scripts aren't defined as a module, leading to overly complicated tests that break easily and are harder to update.

The `.asmdef` files allow you to partition your code into separate assemblies. It's similar to how a `package.json` defines dependencies in Node.js.

For my test environment to work, I had to create the following dependency chain:
1.  **`ThirdPersonControllerMain.asmdef`**: I wrapped the game code in this definition, including player movement and health.
2.  **`Tests.asmdef`**: I created this for my test scripts, including teh build logic
3.  **An Assembely Co Dependency**: In the Inspector, I had to manually add `ThirdPersonControllerMain` to the "Assembly Definition References" of `Tests.asmdef`, so that the tests knew exactly what to compile. It ignored other assets such as lighting, sound, and game management.

## The Experiment
I installed the **Third Person Character Controller** package and attempted to automate the testing of player movement and fall damage. And just like Jest and Playwright, one of my biggest takeaways was the danger of false security. Early in my testing, I got "green checkmarks" on tests that shouldn't have passed because I wasn't properly waiting for physics calculations to resolve. I learned that using logic independent of computer speeds (wait frames vs wait time) is critical in Play Mode tests to allow the engine to process frames between actions (like jumping) and assertions (checking health).

To finish the testing automation, I had to split the pipeline into three parts, similar to our class:
1.  **Build:** I created a script to build a specific "Headless Runner" version of the game, which would ignore all of the other assemblies, including other game scenes, menus, and more, exporting a build that just ran the specific `Tests.asmdef` scripts.
2.  **Run:** The pipeline then runs the tests from the build and outputs an XML file (`testresults.xml`) which is the default output from UTF.
3.  **Report:** I then used an AI generated script to parse that XML into a user friendly HTML dashboard, similar to GitHub Actions.

## Challenges Encountered
1.  **Teseting Failures with the Input System:** Simulating key presses wasn't straight forward. I had to modify the `manifest.json` directly multiple times and use various `Fixture` classes to "press" keys on a virtual keyboard. Additionally, the Input System was introduced close to UTF, and some features still aren't fully compitable which took extra time to find.
2.  **References:** Setting up the `.asmdef` references for the Input System, the Test Runner, and the custom game scripts was error prone. If one reference is missing, which happened a lot due to poor documentation, the code simply won't compile.

## Conclusion
Applying DevOps to game development was challenging due to the visual and physics based nature of the medium. However, I can see the trade off saving a ton of time in the long run, and it's well worth the hours it took to implement. And the reviews and discussions I found about it agree: it allows game developers to catch regressions when creating new features (like breaking the jump mechanic or fall damage logic) immediately after a commit, rather than weeks later during a QA pass, especially for Indie devs like me.