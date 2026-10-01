## Entities
- User
- Preference Profile
- Suggestion
- Visit
- Feedback
- Church
- Service
- Ministry
- Event
- Location
- Administrator


## Entity Relationships
### Person side
- A User has one Preference Profile
- A User makes many Visits
- A User attends many Events
- A User receives many Suggestions

### Suggestions (between User and Church)
- A Preference Profile leads to many Suggestions
- A Suggestion belongs to one User and is for one Church

### Visits and Feedback
- A Visit is made by one User at one Church
- A Visit is for one specific Service
- A Visit leads to zero or one Feedback
- A Feedback belongs to one Visit

### Church side
- A Church has one Location
- A Church has one or more Administrators
- A Church offers one or more Services
- A Church runs zero or more Ministries
- A Church has a list of Events
- A Ministry has many Events
- An Event belongs to one Church and optionally to one Ministry


![Domain Model](Domain_Model_Screenshot.png)