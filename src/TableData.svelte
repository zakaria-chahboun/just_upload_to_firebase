<script>
  import { firebase } from "./firebase.js";
  import { FirebaseApp, Collection, Doc } from "sveltefire";

  // firebase
  let types_collection = "/typesQuestion";
  let question_root = "/questions/questionsCollection";

  // langs
  export let lang = "ar"; // by default

  // Display or Priview images
  let priview_image1 = "";
  let priview_image2 = "";
  let upload = firebase.storage().ref();
</script>

<!-- To choose question langs -->

<table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
  <thead>
    <tr>
      <th>Pos</th>
      <th>ID</th>
      <th>Lang</th>
      <th>Question</th>
      <th>Q.description</th>
      <th>Types</th>
      <th>Answers</th>
      <th>Image question</th>
      <th>Image description</th>
      <th>Audio question</th>
      <th>Audio description</th>
    </tr>
  </thead>

  <FirebaseApp {firebase}>
    <tbody>
      <Collection path="{question_root}/{lang}" let:data={questions} let:ref>
        {#each questions as q, i}
          <tr>
            <!-- index -->
            <td>{i + 1}</td>
            <!-- ID -->
            <td>{q.id}</td>
            <!-- Langs -->
            <td>{lang}</td>
            <!-- Question -->
            <td>{q.textQuestion}</td>
            <!-- Question description -->
            <td>{q.textDescription}</td>
            <!-- Tyes -->
            <td>
              {#each q.typeQuestion as type}
                <Doc path="{types_collection}/{type}" let:data>
                  {#if lang === 'fr'}
                    {data.fr}
                  {:else if lang === 'en'}{data.en}{:else}{data.ar}{/if}
                </Doc>
                <br />
              {/each}
            </td>
            <!-- Answers -->
            <td>
              {#each q.answers as answer}
                {#if answer.isCorrect}
                  {answer.text} :
                  <span class="icon has-text-info">
                    <i class="fas fa-thumbs-up" />
                  </span>
                {:else}
                  {answer.text} :
                  <span class="icon has-text-danger">
                    <i class="fas fa-thumbs-down" />
                  </span>
                {/if}
                <br />
              {/each}
            </td>
            <!-- Image Question -->
            <td>
              {#await upload.child(q.imageQuestion).getDownloadURL()}
                <progress class="progress is-primary" max="100" />
              {:then url}
                <figure class="image is-128x128">
                  <img src={url} alt="" style="max-height:128px" />
                </figure>
              {/await}
            </td>
            <!-- Image Description -->
            <td>
              {#await upload.child(q.imageDescription).getDownloadURL()}
                <progress class="progress is-primary" max="100" />
              {:then url}
                <figure class="image is-128x128">
                  <img src={url} alt="" style="max-height:128px" />
                </figure>
              {/await}
            </td>
            <!-- Audio Question -->
            <td>
              {#await upload.child(q.audioQuestion).getDownloadURL()}
                <progress class="progress is-primary" max="100" />
              {:then url}
                <audio controls>
                  <source src={url} type="audio/ogg" />
                  Your browser does not support the audio element.
                </audio>
              {/await}
            </td>
            <!-- Audio Description -->
            <td>
              {#await upload.child(q.audioDescription).getDownloadURL()}
                <progress class="progress is-primary" max="100" />
              {:then url}
                <audio controls>
                  <source src={url} type="audio/ogg" />
                  Your browser does not support the audio element.
                </audio>
              {/await}
            </td>
          </tr>
          <!-- IF NO DATA -->
        {:else}
          <tr>
            <td colspan="11">
              <div class="notification is-warning has-text-centered">
                NO DATA
              </div>
            </td>
          </tr>
        {/each}
        <div slot="loading">
          <tr>
            <td colspan="11">
              <progress class="progress is-primary" max="100" />
            </td>
          </tr>
        </div>
      </Collection>
    </tbody>
  </FirebaseApp>
</table>
