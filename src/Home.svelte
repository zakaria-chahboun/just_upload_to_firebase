<script>
  import Side1 from "./Side1.svelte";
  import Side2 from "./Side2.svelte";
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
      if (DATA.tags.lenght <= 0) {
        throw Error("Tags/Types Empty!");
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
        .child(`Images/${QuestionID}`)
        .put(image, metadata_image);
      await upload
        .ref()
        .child(`Audios/${QuestionID}`)
        .put(audio, metadata_audio);
      await upload
        .ref()
        .child(`Images/Descriptions/${QuestionID}`)
        .put(audio, metadata_image_description);
      await upload
        .ref()
        .child(`Audios/Descriptions/${QuestionID}`)
        .put(audio, audio_description);

      // insert doc in firestore
      await db
        .collection("/questions")
        .doc("questionsCollection")
        .collection(`${DATA.lang}`)
        .doc(`${QuestionID}`)
        .set({
          textQuestion: DATA.question,
          textDescription: DATA.question_description,
          typeQuestion: DATA.tags.map(e => e.id), // add just the id of types
          answers: DATA.answers,
          imageQuestion: `Images/${QuestionID}`,
          imageDescription: `Images/Descriptions/${QuestionID}`,
          audioQuestion: `Audios/${QuestionID}`,
          audioDescription: `Audios/Descriptions/${QuestionID}`
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
    } finally{
      ClearFormInputs();
      ShowAllData();
    }
  }
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
    <Side1 />
  </div>
  <!-- Side 2 -->
  <div class="column">
    <Side2 />
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
  </div>
  <!-- Just a space for decoration -->
  <div class="column is-2" />

</div>
