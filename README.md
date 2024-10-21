# ohrima_backend
Ohrima's backend voor de website 

# Connecting Your Email with Google Cloud Console
To use the email functionality in this application, you will need to set up a Google Cloud project to obtain your Client ID, Client Secret, and Refresh Token. Follow these steps:

Step 1: Create a Google Cloud Project
    1.Visit the Google Cloud Console: Go to Google Cloud Console.
    2.Sign in: Use your Google account to sign in.
    3.Create a New Project:

        *Click on the project dropdown (usually at the top of the page).
        *Click on New Project.
        *Enter a project name and select an organization (if *applicable).
        Click Create.

Step 2: Enable the Gmail API
    1.In your new project dashboard, click on Navigation Menu (☰) > API & Services > Library.
    2.In the API Library, search for "Gmail API".
    3.Click on the Gmail API from the results, and then click the Enable button.

Step 3: Configure OAuth Consent Screen
    1.Click on Navigation Menu (☰) > API & Services > OAuth consent screen.
    2.Select External and click Create.
    3.Fill in the required fields:
        *App name: Your application’s name.
        *User support email: Your email address.
        *Developer contact information: Your email address.
    4.Click Save and Continue until you complete the setup.

Step 4: Create Credentials
    1.Click on Navigation Menu (☰) > API & Services > Credentials.
    2.Click on Create Credentials and select OAuth 2.0 Client IDs.
    3.Choose Web application as the application type.
    4.Fill in the required fields:
        *Name: A name for your OAuth client.
        *Authorized redirect URIs: Add the redirect URI your *application uses (e.g., http://localhost:3000/auth/google/callback).
    5.Click Create.
    6.A pop-up will display your Client ID and Client Secret. Copy and save these credentials securely.

Step 5: Get the Refresh Token
    1.Use the OAuth 2.0 Playground to obtain a Refresh Token:
        *Visit OAuth 2.0 Playground.
        *Click on the gear icon (⚙️) in the top right corner and check *Use your own OAuth credentials. Enter your Client ID and Client Secret.
    2.In the OAuth 2.0 Playground, select the Gmail API scopes you need (e.g., https://www.googleapis.com/auth/gmail.send).
    3.Click Authorize APIs and follow the prompts to log in and authorize the application.
    4.After authorization, click Exchange authorization code for tokens.
    5.The Refresh Token will appear in the response. Copy and save it securely.

Step 6: Configure Your Application
    1.Open the .env file in your project directory.
    2.Set the following variables with the credentials obtained:
        "GOOGLE_CLIENT_ID=your-client-id
        GOOGLE_CLIENT_SECRET=your-client-secret
        GOOGLE_REFRESH_TOKEN=your-refresh-token"
    3.Save the changes to the .env file.
