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

1. As a student, I can see a welcome screen when I open the app for the first time.
2. As a student, I can choose to sign up or skip sign-up and go straight to the preference questions.
3. As a student, I can answer a set of preference questions (like denomination, worship style, and distance from campus) so the app can suggest churches for me.
4. As a student, I can see a list of suggested churches based on my answers.
5. As a student, I can view details about a suggested church (like name, address, and service times).
6. As a student, I can rate or leave feedback on a church after visiting it.
7. As a student who has committed to a church, I can get reminders or updates to help me stay active there.
8. As a student, I can save my results if I signed up for an account.

### 3.2 Non-Functional Requirements

- **Performance**: Church suggestions should load in under 3 seconds after a student finishes the preference questions.
- **Security**: If a student signs up, their login info and personal data should be stored securely.
- **Usability**: The app should be simple enough to use quickly on a phone, since students will likely use it while busy or on the go.

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