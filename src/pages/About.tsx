import CarouselImages from "../components/CarouselImages";
import { images } from "../lib/imageData";
import Footer from "../components/Footer";
import "./About.css";

export default function About() {
  return (
    <div className="about-main">
      <CarouselImages images={images} />
      <div className="about-container">
        <div className="about-heading">
          <h1>About Seol</h1>
        </div>
        <div className="about-content">
          <p>
            <span>Seol</span> was developed as a side project for my portfolio.
            Now, why did I develop this service? Well, there are two reasons,
            one has a little bit of backstory to it - So, one of my friends had
            sent me some files over a we share link once (
            <i>which as usual I had forgotten about</i>), and when I actually
            remembered and went to download the file, the link had already
            expired because we share links have an expiry set for 7 days on free
            instances(
            <i>
              I dont know about paid or upgraded versions, haven't tried it and
              probably will never try it as well
            </i>
            ). So, I wanted to have a file sharing service with longer or no
            expiration time at all, obviously I can use some of the cloud
            storages available out there like the most popular one Google Drive
            but I did not want to clutter up my personal drive spaces for files
            that I only want to share and probably will never need again. This
            led me to the second reason as to why I developed seol (
            <i>a we share clone</i>), I read an article on URL shorteners and
            wanted to make one of my own, at this point I had not researched
            much about any other file sharing services out there so ultimately I
            decided to develop my own online file sharing service with my own
            URL shortening feature.
            <br /> <br />I based the design and the functionality of the site on{" "}
            <span>We-Share</span> upto some extent for familiarity, obviously if
            necessary the entire styling can be changed. The download URL after
            uploading a file/files has an expiration time of 20 days (
            <i>
              yes, I know, I wanted no expiration at all but turns out if others
              start using your project, storage might become an issue
            </i>
            ), there is another feature that we share lacks which is{" "}
            <span>resuming an upload</span> (
            <i>
              again, I am talking about the free instance not a paid or an
              upgraded version
            </i>
            ) for some reason if you face any network issue or the browser
            crashes, you have to reupload your files from the begining. I wanted
            to get rid of this problem as well, so in <span>Seol</span> if
            somehow you face any issues while uploading a file/files, you can
            come back later to resume your upload, however, there is no
            pause/play option, also you have to resume your upload within 7 days
            post which if you try to upload the files you might get an upload
            error.
            <i>
              (p.s. - Resuming an upload may not always work, sometimes you
              might get an error depending on various factors as to when the
              upload was interrupted and what was the root reason for the
              interruption. The files are uploaded in chunks, so somehow if the
              data gets corrupted due to an interruption, the server will throw
              an error and stop the upload)
            </i>
            <br /> <br />
            Once the files are uploaded you get a short url, which redirects you
            to the download page from where you or your friends and family can
            download the uploaded file. Now, there is a slight setback, the
            maximum size of file/files you can upload here should be below or
            equal to 500mb 🙂. Since the entire project is currently running on
            free and limited resources, I couldn't take the risk of setting a
            higher size cap, again if required that can be increased.
          </p>
          <br />
          <h3>Security</h3>
          <p style={{ paddingBottom: "2rem" }}>
            The site follows an <span>AES encryption</span> technique, all the
            information and the files that are submitted/uploaded are first
            encrypted and then sent to the server for further processing,
            similarly, the responses sent from the server are encrypted which
            are decrypted on the frontend and then used for futher processing.
            <br />
            The files are not stored on the server but on the{" "}
            <span>dropbox cloud storage</span> who has their own secure
            mechanism, so they are kept locked and secured. <br />
            <br />
            The site uses your browser's local storage and IndexedDB for caching
            data in order to help with resuming upload
          </p>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
