## James Teuscher Self Penetration Test Notes

| Item           | Result                                                                                                                                                                                               |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date           | December 4, 2025                                                                                                                                                                                     |
| Target         | https://pizza-service.jtdevops.click/                                                                                                                                                                |
| Classification | Insecure Design                                                                                                                                                                                      |
| Severity       | 2-3                                                                                                                                                                                                  |
| Description    | HTTP Requests to Pizza Factory were intercepted and prices of JWT Pizzas decreased, resulting in loss of revenue. I was able to do this attack in class as Dr. Jensen demonstrated it.               |
| Image          | ![JWT Pizza Lower Price Hack](./freeJWTPizzaHack.png) Pizza price is 0 (Free pizzas!)                                                                                                                |
| Correction     | My peer could correct this by asserting that the price listed in the response from the pizza factory must equal the price of the pizza listed in the database. If the price differs, the order fails |

| Item           | Result                                                                                                                                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Date           | December 4, 2025                                                                                                                                                                                                               |
| Target         | https://pizza-service.jtdevops.click/                                                                                                                                                                                          |
| Classification | Identification and Authentication Failures                                                                                                                                                                                     |
| Severity       | 0                                                                                                                                                                                                                              |
| Description    | I attempted to use a `cURL` command to hit the registration endpoint with correct parameters to make my own admin user, outside of the default one. After I couldn't execute this attack on my peer, I attempted it on myself. |
| Image          | ![cURL Make Admin User](./curlAdmin.png) This attack failed, as I either did not hit the right endpoint or didn't have the right request body                                                                                  |
| Correction     | No correction is necessary because no attacks were successful.                                                                                                                                                                 |

| Item           | Result                                                                                                         |
| -------------- | -------------------------------------------------------------------------------------------------------------- |
| Date           | December 9, 2025                                                                                               |
| Target         | https://pizza-service.jtdevops.click/                                                                          |
| Classification | Identification and Authentication Failures                                                                     |
| Severity       | 0                                                                                                              |
| Description    | Attempted to use Burp Proxy and Repeater to send register requests with correct body to register an admin user |
| Image          | ![Repeater Intercepted Request](./repeaterInterceptedReq.png)                                                  |
| Correction     | No correction seemed necessary since the attack was unsuccessful                                               |

## Summary of Learnings: James Teuscher

- One of my biggest takeaways is that cyber defense requires just as much knowledge of attacks as offense. During the penetration testing, I felt fairly lost on how to attack my peer, but I also felt pretty lost on how to defend against their attacks, and recover from them. This makes me realize how critical a knowledge of cyber security is.
- Another takeaway for me was the importance of metrics. I was able to detect some of my peer's more subtle attacks/infiltrations because of my logging when these attacks weren't visible on the front end. This shows me that metrics and logging are critical for detecting *all* types of attacks.
- I think another takeaway for me is the importance of understanding all of the code, *from a security standpoint*. After Deliverable 1, and throughout the class, I felt I could confidently say that I knew the code for JWT Pizza pretty well. But, my understanding, even if it was good, was from more of a functional, software engineering standpoint. When it came to my security understanding of the code: what was safe, what was vulnerable, and *why* those things were safe or vulnerable, my understanding was, admittedly, virtually nonexistent. I think after this experience, I am more motivated to learn cyber security and be able to analyze code from a security standpoint.

