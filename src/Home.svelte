<script>
  import Side1 from "./Side1.svelte";
  import Side2 from "./Side2.svelte";
  import TableData from "./TableData.svelte";
  import Notification from "./Notification.svelte";

  import { get } from "svelte/store";
  import { transport1, transport2 } from "./Store.js";

  import { firebase } from "./firebase.js";
  //import { FirebaseApp, Doc, Collection } from "sveltefire";

  /**** Notifications handling message ******/
  let showUpNotification = false;
  let type = "";
  let message = "";
  let isLoading = false;

  // Retireve Extension (from file :)
  function retrieveExtension(filename, extension) {
    let fn = filename.split(".").pop();
    if (fn.toLowerCase() === extension.toLowerCase()) return true;
    return false;
  }

  // Firebase
  let db = firebase.firestore();
  let upload = firebase.storage();

  // Adding Data to Firebase
  let DATA = {};
  async function getData() {
    let data1 = get(transport1);
    let data2 = get(transport2);
    DATA = { ...data1, ...data2 };

    try {
      // check if questions & answers: exit
      if (DATA.questions_answers.length <= 0) {
        throw Error("Questions and answers Empty!");
      }
      // check if no file to upload: exit
      if (
        !DATA.image_file[0] ||
        !DATA.audio_file[0] ||
        !DATA.image_description_file[0] ||
        !DATA.audio_description_file[0]
      ) {
        throw Error("Image or Audio is empty!");
      }
      // check if tags/types: exit
      if (DATA.tags.length <= 0) {
        throw Error("Tags/Types Empty!");
      }
      // Check File Extension (png/ogg): exit
      if (
        !retrieveExtension(DATA.image_file[0].name, "png") ||
        !retrieveExtension(DATA.image_description_file[0].name, "png")
      ) {
        throw Error("We can accept only '.png 'image format");
      }
      if (
        !retrieveExtension(DATA.audio_file[0].name, "ogg") ||
        !retrieveExtension(DATA.audio_description_file[0].name, "ogg")
      ) {
        throw Error("We can accept only '.ogg 'audio format");
      }

      isLoading = true; // ui/ux

      const image = DATA.image_file[0];
      const audio = DATA.audio_file[0];
      const image_description = DATA.image_description_file[0];
      const audio_description = DATA.audio_description_file[0];

      const metadata_image = {
        contentType: image.type
      };
      const metadata_audio = {
        contentType: audio.type
      };
      const metadata_image_description = {
        contentType: image_description.type
      };
      const metadata_audio_description = {
        contentType: audio_description.type
      };

      // Get the doc ID
      let QuestionID = await db
        .collection("/questions")
        .doc("questionsCollection")
        .collection(`${DATA.lang}`)
        .doc().id;

      //Uploads files
      await upload
        .ref()
        .child(`Images/${QuestionID}_Q.png`)
        .put(image, metadata_image);
      await upload
        .ref()
        .child(`Audios/${QuestionID}_Q.ogg`)
        .put(audio, metadata_audio);
      await upload
        .ref()
        .child(`Images/${QuestionID}_D.png`)
        .put(image_description, metadata_image_description);
      await upload
        .ref()
        .child(`Audios/${QuestionID}_D.ogg`)
        .put(audio_description, audio_description);

      // insert doc in firestore
      await db
        .collection("/questions")
        .doc("questionsCollection")
        .collection(`${DATA.lang}`)
        .doc(`${QuestionID}`)
        .set({
          questionsAnswers: DATA.questions_answers,
          textDescription: DATA.question_description,
          typeQuestion: DATA.tags.map(e => e.id), // add just the id of types
          imageQuestion: `Images/${QuestionID}_Q.png`,
          imageDescription: `Images/${QuestionID}_D.png`,
          audioQuestion: `Audios/${QuestionID}_Q.ogg`,
          audioDescription: `Audios/${QuestionID}_D.ogg`
        });

      isLoading = false;
      showUpNotification = true;
      type = "is-success";
      message = "Question has been added successfully.";
      setTimeout(() => {
        showUpNotification = false;
      }, 3000);
    } catch (error) {
      isLoading = false;
      showUpNotification = true;
      type = "is-warning";
      message = error.message;
      setTimeout(() => {
        showUpNotification = false;
      }, 3000);
    }
  }

  // This is just for transform 'lang' from 'Side1' passing-by 'Home' to 'TableData'
  // for that we use (bind:prop) => (bind:lang)
  let CHOSEN_LANG;

  // This is just for clean all field of (Side1 and 2)
  // for that we use (bind:clean)
  let CLEAN = false;
</script>

<style>
  .up {
    margin-top: 1em;
  }
</style>

<!-- *** Notification *** -->
{#if showUpNotification}
  <Notification
    {type}
    {message}
    on:click={() => {
      showUpNotification = false;
    }} />
{/if}

<!-- *** Body *** -->
<div class="columns up">
  <!-- Just a space for decoration -->
  <div class="column is-2" />

  <!-- Side 1 -->
  <div class="column">
    <Side1 bind:lang={CHOSEN_LANG} bind:clean={CLEAN} />
  </div>
  <!-- Side 2 -->
  <div class="column">
    <Side2 bind:clean={CLEAN} />
  </div>

  <!-- Just a space for decoration -->
  <div class="column is-2" />
</div>

<!-- *** ADD TO DATABASE *** -->
<div class="columns">
  <!-- Just a space for decoration -->
  <div class="column is-2" />

  <div class="column">
    <button
      class="button is-success is-fullwidth {isLoading ? 'is-loading' : ''}"
      on:click={getData}>
      ADD TO DATABASE
    </button>
    <button class="button is-info is-fullwidth" on:click={() => (CLEAN = true)}>
      CLEAN UP
    </button>
  </div>

  <!-- Just a space for decoration -->
  <div class="column is-2" />
</div>

<!-- DEVIDER -->
<div class="is-divider" data-content="SHOW TABLES" />

<!-- TABLES OF DATA -->
<div class="columns up">

  <!-- DATA -->
  <div class="column">
    <TableData bind:lang={CHOSEN_LANG} />
  </div>

</div>
