[Polska wersja README](README.md)
# Wulkanowy Bridge

## What is Wulkanowy Bridge?
Wulkanowy Bridge is a service, which allows apps to access data from VULCAN UONET+ using a well-documented API. 

## Project features
- Uses [wulkanowy/sdk-node](https://github.com/wulkanowy/sdk-node)
- Implements **OAuth2.0** protocol
- API uses **GraphQL** and supports [schema introspection](https://graphql.org/learn/introspection/)
- Apps (clients) don't have access to user's login and password
- [We encrypt data stored in our database, to limit the scope of an attack](#how-does-wulkanowy-bridge-protect-login-info-of-users)
- Apps specify the access scope and user is informed about it

## How does Wulkanowy Bridge protect login info of users?
To reduce the consequences of unauthorised access to our server or database, login and session information is encrypted in the database. The key needed to decrypt the information is in the access token generated for an app, so accessing the database doesn't, by itself, allow to decrypt the information. 
**Wulkanowy Bridge ma możliwość odszyfrowania tych informacji wyłącznie podczas zapytania przez aplikację (przy każdym zapytaniu wysyłany jest token)**
**Wulkanowy Bridge can decrypt the information only when a request is made by an app (the access token is sent with every request)** 
