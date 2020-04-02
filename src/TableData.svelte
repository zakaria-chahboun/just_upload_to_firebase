<script>
  import { firebase } from "./firebase.js";
  import { FirebaseApp, Collection, Doc } from "sveltefire";
  import { slide } from "svelte/transition";

  // firebase
  let types_collection = "/typesQuestion";
  let question_root = "/questions/questionsCollection";

  async function deleteItem(id) {
    let res = confirm(`do you really want to remove this item: '${id}'`);
    if (res) {
      try {
        await firebase
          .firestore()
          .doc(`${question_root}`)
          .collection(`${lang}`)
          .doc(`${id}`)
          .delete();

        await upload
          .child(`Images/${id}_Q.png`)
          .delete();
        await upload
          .child(`Audios/${id}_Q.ogg`)
          .delete();
        await upload
          .child(`Images/${id}_D.png`)
          .delete();
        await upload
          .child(`Audios/${id}_D.ogg`)
          .delete();
      } catch (error) {
        console.log(`FIREBASE ERROR: ${error}`);
      }
    }
  }

  // langs
  export let lang = "ar"; // by default

  // Display or Priview images
  let priview_image1 = "";
  let priview_image2 = "";
  let upload = firebase.storage().ref();

  // Decoration
  let show = false; // show all ...
</script>

<FirebaseApp {firebase}>
  <div class="columns">
    <!-- To choose question langs -->
    <Collection path="{question_root}/{lang}" let:data={questions} let:ref>
      {#each questions as q, i}
        <div class="column is-2">
          <div class="card">
            <header class="card-header">
              <!-- ID -->
              <div class="card-header-title">
                ID:
                <span style="font-size:10pt;">{q.id}</span>
              </div>
              <!-- Delete Button Icon -->
              <a
                class="card-header-icon"
                aria-label="more options"
                on:click={() => deleteItem(q.id)}>
                <span class="icon">
                  <i class="fas fa-trash" aria-hidden="true" />
                </span>
              </a>
            </header>

            <div class="card-content">
              <div>
                <!-- Lang -->
                <p>
                  <strong>Lang:</strong>
                  {lang}
                </p>
                <!-- Description -->
                <p>
                  <strong>Description</strong>
                  : {q.textDescription}
                </p>
                <!-- Types-->
                <p>
                  <strong>Types:</strong>
                  {#each q.typeQuestion as type}
                    <Doc path="{types_collection}/{type}" let:data>
                      {#if lang === 'fr'}
                        {data.fr}
                      {:else if lang === 'en'}{data.en}{:else}{data.ar}{/if}
                    </Doc>
                    <br />
                  {/each}
                </p>
                <!-- Image -->
                <div class="columns">
                  <div class="column">
                    {#await upload.child(q.imageQuestion).getDownloadURL()}
                      <progress class="progress is-primary" max="100" />
                    {:then url}
                      <figure class="image">
                        <img src={url} alt="" />
                      </figure>
                    {/await}
                  </div>
                  <!-- Image Description -->
                  <div class="column">
                    {#await upload.child(q.imageDescription).getDownloadURL()}
                      <progress class="progress is-primary" max="100" />
                    {:then url}
                      <figure class="image">
                        <img src={url} alt="" />
                      </figure>
                    {/await}
                  </div>
                </div>
                <!-- Audio -->
                {#await upload.child(q.audioQuestion).getDownloadURL()}
                  <progress class="progress is-primary" max="100" />
                {:then url}
                  <audio controls style="width: 100%">
                    <source src={url} type="audio/ogg" />
                    Your browser does not support the audio element.
                  </audio>
                {/await}
                <!-- Audio Description -->
                {#await upload.child(q.audioDescription).getDownloadURL()}
                  <progress class="progress is-primary" max="100" />
                {:then url}
                  <audio controls style="width: 100%">
                    <source src={url} type="audio/ogg" />
                    Your browser does not support the audio element.
                  </audio>
                {/await}
                <!-- Question and Answers -->
                {#if show}
                  <div transition:slide>
                    <aside class="menu">
                      {#each q.questionsAnswers as qa, i}
                        <ul class="menu-list">
                          <!-- show question -->
                          <li>
                            <span class="menu-label">{qa.text_question}</span>
                          </li>
                          <!-- show answers -->
                          <li>
                            {#each qa.answers as a, j}
                              <ul>
                                <li>
                                  <div class="field has-addons">
                                    <div class="control">
                                      <button class="button is-static is-small">
                                        {j + 1}
                                      </button>
                                    </div>
                                    <div class="control is-expanded">
                                      <input
                                        type="text"
                                        class="input is-small"
                                        value={a.text}
                                        readonly />
                                    </div>
                                    <div class="control">
                                      <button class="button is-static is-small">
                                        {#if a.isCorrect}
                                          <span class="icon has-text-success">
                                            <i class="fas fa-thumbs-up" />
                                          </span>
                                        {:else}
                                          <span class="icon">
                                            <i class="fas fa-thumbs-down" />
                                          </span>
                                        {/if}
                                      </button>
                                    </div>
                                  </div>
                                </li>
                              </ul>
                            {/each}
                          </li>
                        </ul>
                      {/each}
                    </aside>
                  </div>
                {/if}
              </div>
            </div>
            <footer class="card-footer">
              <!-- Show All Button -->
              <button
                class="card-footer-item button is-warning"
                on:click={() => (show = !show)}>
                {#if show}
                  <span class="icon">
                    <i class="fas fa-caret-up" />
                  </span>
                {:else}
                  <span class="icon">
                    <i class="fas fa-caret-down" />
                  </span>
                {/if}
              </button>
            </footer>
          </div>
        </div>

        <!-- IF NO DATA -->
      {:else}
        <div class="column">
          <div class="notification has-text-centered">NO DATA</div>
        </div>
      {/each}

      <!-- Loading .. progress bar -->
      <div slot="loading">
        <progress class="progress is-primary" max="100" />
      </div>
    </Collection>
  </div>
</FirebaseApp>
