<script>
  import { firebase } from "./firebase.js";
  import { FirebaseApp, Doc, Collection } from "sveltefire";
  import Notification from "./Notification.svelte";

  //Notifications handling message
  let showUpNotification = false;
  let type = "";
  let message = "";
  let isLoading = false;

  // props
  let text_type_ar = "";
  let text_type_fr = "";
  let text_type_en = "";
  let _types; // important for firebase in bottom
  let progressbar_type = false; // on update: show it!

  // Clean All Filds
  function clean() {
    text_type_ar = text_type_fr = text_type_en = "";
  }

  // Add new type (Store in firebase)
  let types_collection = "/typesQuestion";
  let db = firebase.firestore();

  async function addType() {
    if (text_type_ar === "") {
      showUpNotification = true;
      type = "is-warning";
      message = "Arabic field is empty!";
      setTimeout(() => {
        showUpNotification = false;
      }, 2000);
      return;
    }
    if (text_type_fr === "") {
      showUpNotification = true;
      type = "is-warning";
      message = "French field is empty!";
      setTimeout(() => {
        showUpNotification = false;
      }, 2000);
      return;
    }
    if (text_type_en === "") {
      showUpNotification = true;
      type = "is-warning";
      message = "Eglish field is empty!";
      setTimeout(() => {
        showUpNotification = false;
      }, 2000);
      return;
    }

    try {
      isLoading = true;

      await db
        .collection(`${types_collection}`)
        .doc(
          `${text_type_en
            .trim()
            .split(" ")
            .join("_")}`
        )
        .set({
          ar: text_type_ar,
          fr: text_type_fr,
          en: text_type_en
        });

      isLoading = false;
      showUpNotification = true;
      type = "is-success";
      message = "Type has been added successfully.";
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
  .rtl {
    direction: rtl;
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

  <!-- Add Types -->
  <div class="column">
    <label class="label">Add New Type</label>
    <div class="field has-addons">
      <!-- Add English Type -->
      <div class="control has-icons-left is-expanded">
        <input
          type="text"
          class="input "
          bind:value={text_type_en}
          placeholder="Engilsh type .." />
        <span class="icon is-left">
          <i class="fas fa-file-alt" />
        </span>
      </div>
      <!-- Add French Type -->
      <div class="control has-icons-left is-expanded">
        <input
          type="text"
          class="input "
          bind:value={text_type_fr}
          placeholder="French type .." />
        <span class="icon is-left">
          <i class="fas fa-file-alt" />
        </span>
      </div>
      <!-- Add Arabic Type -->
      <div class="control has-icons-left is-expanded">
        <input
          type="text"
          class="input rtl"
          bind:value={text_type_ar}
          placeholder="Arabic type .." />
        <span class="icon is-left">
          <i class="fas fa-file-alt" />
        </span>
      </div>
      <!-- Pull All Types -->
      <div class="control">
        <button
          class="button is-success {isLoading ? 'is-loading' : ''}"
          on:click={addType}>
          <span class="icon">
            <i class="fas fa-plus" />
          </span>
        </button>
      </div>
      <!-- Clean Fields -->
      <div class="control">
        <button
          class="button has-tooltip-bottom"
          data-tooltip="clean all fields"
          on:click={clean}>
          <span class="icon">
            <i class="fas fa-broom" />
          </span>
        </button>
      </div>
    </div>
  </div>

  <!-- Just a space for decoration -->
  <div class="column is-2" />
</div>

<!-- Firebase Realtime Data (Fetch and Update) -->
<div class="columns up">
  <!-- Just a space for decoration -->
  <div class="column is-2" />

  <div class="column">
    <FirebaseApp {firebase}>
      <!-- you have to declare "_types" in "script tag" to can write on it ;) not only read it -->
      <Collection path={types_collection} let:data={_types} let:ref>
        <!--  Loading bar -->
        <div slot="loading">
          <progress class="progress is-primary" max="100" />
        </div>
        <!-- Recive Data -->
        {#each _types as type}
          <div class="field has-addons">
            <!-- Fetch English Type -->
            <div class="control">
              <button class="button is-static">ID: {type.id}</button>
            </div>
            <div class="control is-expanded">
              <input
                type="text"
                class="input "
                bind:value={type.en}
                placeholder="Engilsh type .." />
            </div>
            <!-- Fetch French Type -->
            <div class="control is-expanded">
              <input
                type="text"
                class="input "
                bind:value={type.fr}
                placeholder="French type .." />
            </div>
            <!-- Fetch Arabic Type -->
            <div class="control is-expanded">
              <input
                type="text"
                class="input rtl"
                bind:value={type.ar}
                placeholder="Arabic type .." />
            </div>
            <!-- Updatde All Types -->
            <div class="control">
              <button
                class="button is-success"
                on:click={async () => {
                  progressbar_type = true;
                  try {
                    await ref
                      .doc(type.id)
                      .update({
                        ar: type.ar,
                        fr: type.fr,
                        en: type.en
                      });
                    progressbar_type = false;
                  } catch (error) {
                    progressbar_type = false;
                    showUpNotification = true;
                    type = 'is-danger';
                    message = error.message;
                    setTimeout(() => {
                      showUpNotification = false;
                    }, 2000);
                  }
                }}>
                <span class="icon">
                  <i class="fas fa-save" />
                </span>
              </button>
            </div>
          </div>
          <!-- IF NO DATA -->
        {:else}
          <div class="notification is-warning has-text-centered">NO DATA</div>
        {/each}
      </Collection>
    </FirebaseApp>

    <!-- Progress bar When update types by click on save -->
    {#if progressbar_type}
      <progress class="progress is-primary" max="100" />
    {/if}
  </div>
  <!-- Just a space for decoration -->
  <div class="column is-2" />
</div>
