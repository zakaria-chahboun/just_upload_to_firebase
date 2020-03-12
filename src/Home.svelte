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
      if (!DATA.image_file[0] || !DATA.audio_file[0]) {
        throw Error("Image or Audio is empty!");
      }
      isLoading = true; // ui/ux

      const image = DATA.image_file[0];
      const audio = DATA.audio_file[0];
      const metadata_image = {
        contentType: image.type
      };
      const metadata_audio = {
        contentType: audio.type
      };

      let upload_image = await upload
        .ref()
        .child(`Images/${image.name}`)
        .put(image, metadata_image);
      let upload_audio = await upload
        .ref()
        .child(`Audios/${audio.name}`)
        .put(audio, metadata_audio);

      let image_url = await upload_image.ref.getDownloadURL();
      let audio_url = await upload_audio.ref.getDownloadURL();

      await db
        .collection("/questions")
        .doc("questionsCollection")
        .collection(`${DATA.lang}`)
        .doc()
        .set({
          textQuestion: DATA.question,
          textDescription: DATA.question_description,
          typeQuestion: DATA.type,
          answers: DATA.answers,
          imageQuestion: image_url,
          imageDescription: DATA.image_description,
          audioQuestion: audio_url,
          audioDescription: DATA.audio_description
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
