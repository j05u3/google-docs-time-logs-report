How to use:
====

https://user-images.githubusercontent.com/7897132/225855719-adbe8e63-aba2-4ea4-b98b-ad065713c27c.mp4

Example file: https://docs.google.com/document/d/1ZBw2Yv39hucRXpPvJNDya-xy2Q23EKOBJ7eaGGm2el4

How to deploy:
====

1. Install clasp: `npm install -g @google/clasp`
2. Login to your Google account: `clasp login`
3. Enable the Google Apps Script API: https://script.google.com/home/usersettings
4. Change the scriptId on `.clasp.json` to the scriptId of your Google Apps Script project (you can find it on the URL when you open the script on the browser)
5. Make the desired changes to the code (`main.ts`)
6. Install libraries: `npm i`
7. Deploy: `clasp push`

References used:
====
* https://medium.com/analytics-vidhya/typescript-in-google-app-script-f0f10c7225de
* https://github.com/google/clasp
* https://developers.google.com/apps-script/guides/clasp
* https://developers.google.com/apps-script/guides/typescript
