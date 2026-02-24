# **App Name**: Suit & Sweat

## Core Features:

- User Authentication: Allow users to create accounts and log in securely using Firebase Authentication. User credentials and preferences will be managed via this service.
- Customizable Workout Setup: Enable users to select the number of card suits, define and manage custom exercises, and map card ranks (Ace through King) to specific exercises. These user-defined settings and exercise lists will be persistently stored and retrieved from Firestore.
- Dynamic Timer Configuration: Provide interactive controls, such as spin-dial inputs, for setting work time per card, rest time between cards, and round rest duration between suits. The total estimated workout time will be calculated and displayed dynamically based on these inputs.
- Interactive Workout Interface: Present the current card prominently, alongside a real-time countdown timer for the active phase (work or rest) and a visual progress indicator. Essential controls like Play/Pause and Skip buttons will be clearly displayed and appropriately sized for easy interaction on mobile and desktop.
- Automated Workout Flow & Deck Management: Implement the core game mechanics, including automatic advancement through cards after the rest timer, and ensure a randomized deck where each exercise appears a total number of times equal to the selected number of suits.
- Workout Summary & History: Upon completion of a workout, display a 'Workout Complete' screen with the total elapsed time and an estimated calorie burn (Total Minutes * 8). All completed workout sessions and their summary data will be saved to Firestore, allowing users to review their history.
- AI-Powered Motivation & Tips Tool: A generative AI tool dynamically provides motivational messages, brief technique tips, or encouraging phrases, contextually relevant to the current exercise or overall workout phase, displayed prominently within the user interface.

## Style Guidelines:

- Primary color: A vibrant purple (#984CEB) chosen to provide an energetic yet sophisticated contrast against the dark background, inspiring focus during exercise. (HSL: 260, 70%, 60%)
- Background color: A very dark, subtle purple-tinted grey (#19161E), maintaining a modern dark theme and ensuring high readability. (HSL: 260, 15%, 10%)
- Accent color: A bright, saturated blue (#A0CEFF), analogous to the primary color, used for interactive elements and highlights to draw attention and enhance usability in a high-contrast environment. (HSL: 230, 80%, 70%)
- All text will use 'Inter', a grotesque sans-serif font known for its modern, objective aesthetic and excellent readability across various screen sizes, suitable for both headlines and smaller informational text during intense workout periods.
- Utilize a consistent set of clean, minimalist outline-style icons for intuitive navigation and control, ensuring high visibility against the dark background. Icons for card suits, play/pause, skip, and settings will be crucial.
- The layout will be fully mobile-responsive, prioritizing large, tappable areas for controls during workouts. Content will dynamically adjust for optimal viewing and interaction on screens ranging from smartphones to desktop monitors, ensuring a smooth user experience regardless of device.
- Implement subtle, fluid animations for countdown timers, progress bars, and card transitions. These animations will enhance feedback and engagement without being distracting or slowing down the application, contributing to a modern and responsive feel.