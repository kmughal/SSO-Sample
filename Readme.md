# Single Sign-On (SSO) Sample with React MSAL and Passport.js

This project demonstrates a basic Single Sign-On (SSO) implementation using React MSAL (Microsoft Authentication Library) for the frontend and Passport.js for the backend. It allows users to authenticate using Microsoft Azure Active Directory (Azure AD) and access protected resources.

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:kmughal/SSO-Sample.git
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

## Configuration

### Server

Populate the following environment variables related to your Azure AD and registered app

- AUTHORITY= Authority in Azure AD.
- POLICY= Policy in Azure AD.
- TENANT_ID= Tenant ID 
- CLIENT_ID= Client ID of your registered app in Azure AD.
- CLIENT_SECRET= Client secret of your registered app in Azure AD.
- SCOPE = Client scope of your registered app in Azure AD.

### Client

Populate the following environment variable with the required scope:

- REACT_APP_SCOPES: Scope required for authentication.
- REACT_APP_API_URL: Base url for the back end api.
- REACT_APP_CLIENT_ID: Client ID which you can find in the azure entraid portal
- REACT_APP_AUTHORITY: Authority url which you can find in the azure entra portal
- REACT_APP_REDIRECT_URI: The url which you have set up in the azure entra portal once the sign in flow is completed
- REACT_APP_KNOWN_AUTHORITIES: Known authority

## Running the Project

You can start the entire project by:

```bash

yarn start

```

## Acknowledgments

- This project was inspired by the need for a simple and straightforward Single Sign-On solution using React and Passport.js.
- Special thanks to the developers and contributors of React MSAL and Passport.js for their excellent work in providing authentication solutions for Node.js and React applications.