-- Starting data for Church Match (the same 6 churches as the old mock data).
-- Safe to run again: it clears the old sample rows first, then re-adds them.

TRUNCATE TABLE favorites, event_attendees, visits, suggestions, events, ministries,
               services, administrators, users, churches RESTART IDENTITY CASCADE;

INSERT INTO churches (name, address, city, state, zip, denomination, worship_style, description, rating, distance_miles) VALUES
('Cathedral of St. Andrew',        '301 Sheldon Blvd SE',      'Grand Rapids', 'MI', '49503', 'Catholic',           'Liturgical',   'Beautiful historic cathedral offering reverent traditional Catholic Mass near downtown.', 4.8, 1.8),
('Crossroads Bible Church',        '800 Scribner Ave NW',      'Grand Rapids', 'MI', '49504', 'Nondenominational',  'Contemporary', 'Engaging modern worship and biblically focused teaching close to campus.',                4.7, 2.3),
('Calvary Church',                 '707 East Beltline Ave NE', 'Grand Rapids', 'MI', '49525', 'Nondenominational',  'Blended',      'Large community with extensive student ministry programs and outreach groups.',          4.6, 5.1),
('Madison Square Church',          '1441 Madison Ave SE',      'Grand Rapids', 'MI', '49507', 'Christian Reformed', 'Contemporary', 'A diverse urban congregation passionate about justice, community, and gospel grace.',    4.9, 3.0),
('Mayflower Congregational Church','2345 Robinson Rd SE',      'Grand Rapids', 'MI', '49506', 'Congregational',     'Traditional',  'Thoughtful sermons, classical organ and choir music, and warm hospitality.',             4.4, 3.8),
('Ada Bible Church (East Paris)',  '1640 E Paris Ave SE',      'Grand Rapids', 'MI', '49546', 'Nondenominational',  'Contemporary', 'High-energy contemporary worship with practical, clear teaching.',                       4.7, 6.2);

-- Weekly services (church ids 1-6 follow the order above).
INSERT INTO services (church_id, day_of_week, start_time) VALUES
(1, 'Sunday', '08:30'), (1, 'Sunday', '10:30'), (1, 'Sunday', '17:30'),
(2, 'Sunday', '09:00'), (2, 'Sunday', '10:45'),
(3, 'Sunday', '09:00'), (3, 'Sunday', '10:45'),
(4, 'Sunday', '10:00'),
(5, 'Sunday', '10:00'),
(6, 'Sunday', '09:00'), (6, 'Sunday', '11:00');

-- One sample student, so the sample comments have an author.
INSERT INTO users (email_address, name, denomination, worship_style, service_time, max_distance) VALUES
('sample.student@church-match.app', 'Sample Student', 'Nondenominational', 'Contemporary', 'Sunday morning', 5.0);

-- Sample comments, saved as visits (the comment text is what the app shows).
INSERT INTO visits (user_id, service_id, visit_time, rating, comment) VALUES
(1, 1,  '2026-10-04 10:30-04', 5, 'Welcoming community with active young adult and college groups.'),
(1, 4,  '2026-10-11 09:00-04', 5, 'Great worship team and easy to find rides from campus.'),
(1, 8,  '2026-10-18 10:00-04', 5, 'Incredible community and super welcoming to college students.'),
(1, 10, '2026-10-25 09:00-04', 5, 'Great small groups for college students!');