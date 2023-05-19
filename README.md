# Seol, inspired by We Share

## About Seol

`Seol` was developed as a side project for my portfolio. Why did I develop this? Well, there were two reasons, one has a little bit of backstory to it - Once one of my friends had sent me some files over a we share link which as usual I had forgotten about, and when I actually remembered and went to download the file, the link had already expired because we share links have an expiry set for 7 days on free instances(I dont know about paid or upgraded versions, haven't tried it and probably will never try it as well). So, I wanted to have a file sharing service with longer or no expiration time at all, obviously I can use some of the cloud storages available out there like the most popular one Google Drive but I did not want to clutter up my personal drive spaces for files that I only want to share and probably will never need again. This led me to the second reason as to why I developed this kind of a we share clone, I read an article on URL shorteners and wanted to make one of my own, at this point I had not researched much about any other file sharing services so I ultimately decided to develop my own online file sharing site with inbuilt URL shortening facility.

I based the design and the functionality of the site on We-Share upto some extent for familiarity, obviously if necessary the entire styling can be changed. Seol file download URLs' has an `expiration time of 20 days`(yes, I know, I wanted no expiration at all but turns out if others start using your project, storage becomes an issue -\_-), there is another feature which we share lacks i.e. `resuming an upload`, for some reason if you face any network issues or the browser crashes, you have to reupload your files from the begining. I wanted to get rid of this problem as well, so in small share if somehow you face any issues while uploading a file/files, you can come back later to `resume your upload`, however, there is no pause/play option, also you have to resume your upload within 7 days post which if you try to upload the files you might get an error. Once the files are uploaded you get a short url, which redirects you to the download page from where you or your friends and family can download the uploaded file. ( p.s. - `Resuming an upload may not always work, sometimes you might get an error depending on various factors as to when the upload was interrupted and what was the root reason for the interruption. The files are uploaded in chunks, so somehow if the data gets corrupted due to an interruption, the server will throw an error and stop the upload!`
)

Now, there is a slight setback, the maximum size of file/files you can upload here should be below or equal to 500mb 🙂. Since the entire project is currently running on free and limited resources, I couldn't take the risk of setting a higher size cap, again if required that can be increased.

## Security

The site follows an `AES encryption` technique, all the information and files that are submitted/uploaded are first encrypted and then sent to the server for further processing, similarly, the responses sent from the server are encrypted which are decrypted on the client side and then used for futher processing.

The files are not stored on the server, but on the `dropbox cloud storage` who has their own secure mechanism, so the files are kept locked and secured.

## Frontend and Backend

The frontend for seol has been developed using typescript and React.js along with other small libraries and packages. The client also uses your browser's local storage and IndexedDB for caching data in order to provide the `resume upload` functionality.

The backend has been developed on Python using Docker, django, django-rest-framework and other small libraries and packages. Nginx has been used along with django and uWsgi to handle proxy in production.

Feel free to contact or advice any changes to make the site better.
