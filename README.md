# Wulkanowy Bridge
## Czym jest Wulkanowy Bridge?
Wulkanowy Bridge to serwis umożliwiający dostęp do danych z dziennika VULCAN UONET+ poprzez udokumentowane API.

## Cechy projektu
- Wykorzystuje [wulkanowy/sdk-node](https://github.com/wulkanowy/sdk-node)
- Implementuje protokół **OAuth2.0**
- API używa **GraphQL** i wspiera [introspekcję](https://graphql.org/learn/introspection/)
- Aplikacja (klient) nie ma dostępu do loginu i hasła użytkownika
- [Szyfrujemy dane przechowywane w bazie danych, aby ograniczyć skutki ataku](#w-jaki-sposób-wulkanowy-bridge-chroni-dane-logowania-użytkowników)
- Aplikacja określa zakres (`scope`) dostępu, a użytkownik jest o tym informowany

## W jaki sposób Wulkanowy Bridge chroni dane logowania użytkowników?
Aby zmniejszyć skutki dostępu do serwera lub bazy danych dane przez niepożądane osoby dane logowania i informacje o sesjii są w bazie danych zaszyfrowane. Klucz potrzebny do ich zaszyfrowania przechowywany jest w tokenie wystawionym dla aplikacji, więc sam dostęp do bazy danych nie umożliwi odczytania tych informacji.
**Wulkanowy Bridge ma możliwość odszyfrowania tych informacji wyłącznie podczas zapytania przez aplikację (przy każdym zapytaniu wysyłany jest token)**
