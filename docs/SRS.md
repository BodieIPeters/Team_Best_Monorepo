# Software Requirements Specification

## 1. Introduction

### 1.1 Purpose
This document describes the requirements for Church Match,an app that helps college students find church communities near campus that fit their preferences, away from home.

### 1.2 Intended Audience
- Our team (Ama Yeboah, Ryan Deaton, Beyla Ruzindana, Vitus Kaleo-Bioh, Bodie Peters), since we're the ones building the app from this document.
- Our lead engineer, who reviews this before it's approved.
- Our CS 262 instructors, who will grade this document.

### 1.3 Intended Use
This document defines what the system must do, so the team can build, test, and evaluate the app against a shared understanding.

### 1.4 Product Scope
Church Match generates church suggestions for students based on their theological and experiential preferences and feedback from previous suggestions, going beyond Google reviews or word-of-mouth from upperclassmen. Once a student commits to a church, the app also helps them become more active in that community.

## 2. Overall Description

### 2.1 User Needs
A lot of college students, especially freshmen, have a hard time finding a church near campus that actually fits them. Some give up looking. Others just try different churches over and over without ever settling on one. Church Match helps by suggesting churches based on what the student is looking for, using feedback from other students who've used the app.

### 2.2 Assumptions and Dependencies
- Users need a smartphone with internet to use the app.
- The app needs a list of local churches and info about them (like denomination) to make suggestions.

## 3. System Features and Requirements

### 3.1 Functional Requirements

1. As a student, I can see a welcome screen when I open the app, so that I know what the app is for before I start.
2. As a student, I can choose to sign up or skip sign-up, so that I can try the app before committing to an account.
3. As a student, I can answer preference questions (like denomination and worship style), so that the app can suggest churches that fit me.
4. As a student, I can see a list of suggested churches, so that I know where to start looking.
5. As a student, I can view details about a church (name, address, service times), so that I can decide if I want to visit.
6. As a student, I can rate or leave feedback on a church, so that other students can benefit from my experience.
7. As a student who has committed to a church, I can get reminders or updates, so that I stay active there.
8. As a student, I can save my results if I signed up, so that I don't lose my preferences.
9. As a student, I can search for a church by name, so that I can find one I already know about.
10. As a student, I can filter suggestions by distance from campus, so that I only see churches I can realistically get to.
11. As a student, I can filter suggestions by denomination, so that I only see churches that match my beliefs.
12. As a student, I can filter suggestions by worship style, so that I only see churches that match how I like to worship.
13. As a student, I can save a church to a favorites list, so that I can easily find it again later.
14. As a student, I can remove a church from my favorites, so that my list stays relevant to me.
15. As a student, I can retake the preference quiz, so that my suggestions update if my preferences change.
16. As a student, I can see photos of a church, so that I know what to expect before visiting.
17. As a student, I can see other students' ratings and comments, so that I can learn from their experience.
18. As a student, I can write a comment about a church I've visited, so that I can help other students decide.
19. As a student, I can edit or delete my own comment, so that I can fix mistakes or update my opinion.
20. As a student, I can turn on notifications, so that I'm reminded about upcoming church events.
21. As a student, I can turn off notifications, so that I'm not bothered if I don't want reminders.
22. As a student, I can create an account with my email, so that I can save my results across devices.
23. As a student, I can log in to my account, so that I can see my saved churches again.
24. As a student, I can log out of my account, so that my info stays private on shared devices.
25. As a student, I can reset my password, so that I can get back into my account if I forget it.
26. As a student, I can update my preferences anytime, so that I don't have to start the quiz completely over.
27. As a new student, I can see a short explanation of how the app works, so that I understand it the first time I open it.
28. As a student, I can share a church's info with a friend, so that we can decide together.

### 3.2 Non-Functional Requirements

- **Performance**: Church suggestions load in under 3 seconds after the quiz is submitted.
- **Security**: User passwords are stored encrypted, not as plain text.
- **Usability**: A new user can complete the preference quiz in under 2 minutes without help.
- **Availability**: The app is accessible 99% of the time (excluding planned maintenance).
- **Portability**: The app works on both iOS and Android phones.

### 3.4 System Features
- Welcome Screen
- Sign Up / Skip
- Preference Quiz
- Church Suggestions
- Church Profile
- Feedback and Ratings
- Post-Commitment Reminders

## 4. Other Requirements

### 4.1 Database Requirements
The app needs to store:
- Church info (name, address, denomination, worship style, service times)
- User accounts (for students who sign up)
- User preferences (answers to the quiz)
- User feedback and ratings on churches