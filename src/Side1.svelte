<script>
  import { transport1 } from "./Store.js";
  import { firebase } from "./firebase.js";
  import { FirebaseApp, Doc, Collection } from "sveltefire";

  //Question
  let question = "";
  let question_description = "";

  // Answers
  let text = "";
  let isCorrect = false;
  let answers = [];

  // Q&A
  let questions_answers = [];

  // Types: array
  let types_collection = "/typesQuestion"; // for firebase
  let _types; // just for firebase
  let type; // Chosen type
  let tags = []; // arrayof objects: {id, text}

  // Languages
  export let lang = "ar"; //by default

  /*** functions ***/
  // add answers
  function addAnswer() {
    let a = { text, isCorrect };
    answers = [...answers, a];
    text = "";
  }
  // add answers
  function deleteAnswer(index) {
    answers.splice(index, 1);
    answers = answers;
  }
  // add questions and answers to the stuck
  function addQ_A() {
    let qa = {
      text_question: question,
      answers: answers
    };
    questions_answers = [...questions_answers, qa];
    // clear fields
    answers = [];
    question = "";
    text = "";
  }
  // delete questions and answers from the stuck
  function deleteQ_A(index) {
    questions_answers.splice(index, 1);
    questions_answers = questions_answers;
  }

  // Right to left direction (arabic)
  let direction = "";
  $: if (lang === "ar") {
    direction = "rtl";
  } else {
    direction = "";
  }

  // Add type/tag
  function addTag() {
    let id = type;
    let select = document.getElementById("MY_TYPE_SELECT");
    let text = select.options[select.selectedIndex].text;
    let duplicate = false;
    if (tags.length > 0) {
      for (const el of tags) {
        if (el.id === id) {
          duplicate = true;
          return;
        }
      }
    }
    if (!duplicate) {
      tags = [...tags, { id, text }];
    }
  }

  // delete tag
  function deleteTag(index) {
    tags.splice(index, 1);
    tags = tags;
  }

  // ALL DATA TO SEND :)
  $: transport1.set({
    questions_answers,
    question_description,
    tags,
    lang
  });

  // clean data
  export let clean = false;
  $: if (clean) {
    question = "";
    answers = [];
    question_description = "";
    questions_answers = [];
    tags = [];
    clean = false;
  }
</script>

<style>
  .rtl {
    direction: rtl;
  }
</style>

<!-- To choose question langs -->
<label class="label">Choose Language</label>
<div class="control">
  <label class="radio">
    <input type="radio" name="lang2" bind:group={lang} value="en" />
    English
  </label>
  <label class="radio">
    <input type="radio" name="lang2" bind:group={lang} value="fr" />
    French
  </label>
  <label class="radio">
    <input type="radio" name="lang2" bind:group={lang} value="ar" checked />
    Arabic
  </label>
</div>
<br />

<!-- Add question description -->
<label class="label">Add description</label>
<div class="control">
  <textarea
    class="textarea has-fixed-size {direction}"
    placeholder="add description here .."
    bind:value={question_description} />
</div>
<br />

<!-- Types -->
<label class="label">Choose Type</label>
<div class="field has-addons">
  <div class="control is-expanded">
    <div class="select is-fullwidth">
      <FirebaseApp {firebase}>
        <!-- Get the list of types from firestore (realtime updates :) -->
        <!-- you have to declare "_types" in "script tag" to can write on it ;) not only read it -->
        <Collection path={types_collection} let:data={_types} let:ref>
          <select bind:value={type} id="MY_TYPE_SELECT">
            {#each _types as mytype}
              {#if lang === 'en'}
                <option value={mytype.id}>{mytype.en}</option>
              {:else if lang === 'fr'}
                <option value={mytype.id}>{mytype.fr}</option>
              {:else if lang === 'ar'}
                <option value={mytype.id}>{mytype.ar}</option>
              {/if}
            {/each}
          </select>
        </Collection>
      </FirebaseApp>
    </div>
  </div>
  <div class="control">
    <button
      class="button has-tooltip-bottom"
      data-tooltip="click to select type"
      on:click={() => addTag()}>
      <span class="icon">
        <i class="fas fa-clipboard-check" />
      </span>
    </button>
  </div>
</div>

<!-- Tag types-->
<div class="field is-grouped is-grouped-multiline">
  {#each tags as e, i}
    <div class="control" id={e.id}>
      <div class="tags has-addons">
        <a class="tag is-success ">{e.text}</a>
        <a class="tag is-delete" on:click={() => deleteTag(i)} />
      </div>
    </div>
  {/each}
</div>
{#if tags.length === 0}
  <div class="notification has-text-centered">No Tags Here ..!</div>
{/if}

<!-- Q & A -->
<!-- Add question -->
<label class="label">Add question</label>
<div class="field">
  <div class="control has-icons-left is-expanded">
    <input
      type="text"
      class="input {direction}"
      bind:value={question}
      placeholder="add question here .." />
    <span class="icon is-left">
      <i class="fas fa-question-circle" />
    </span>
  </div>
</div>

<!-- Add answer -->
<div class="field has-addons">
  <div class="control has-icons-left is-expanded">
    <input
      type="text"
      class="input {direction}"
      bind:value={text}
      placeholder="add answer here .." />
    <span class="icon is-left">
      <i class="fas fa-file-alt" />
    </span>
  </div>
  <div class="control">
    <div class="select">
      <select bind:value={isCorrect}>
        <option value={false}>false</option>
        <option value={true}>true</option>

      </select>
    </div>
  </div>
  <div class="control">
    <button class="button is-success" on:click={addAnswer}>
      <span class="icon">
        <i class="fas fa-plus" />
      </span>
    </button>
  </div>
</div>

<!-- Answers .. -->
{#each answers as { text, isCorrect }, i}
  {#if answers.lenght !== 0}
    <div class="field has-addons">
      <div class="control">
        <button class="button is-static">{i + 1}</button>
      </div>
      <div class="control is-expanded">
        <input type="text" class="input {direction}" value={text} readonly />
      </div>
      <div class="control">
        <input type="text" class="input" value={isCorrect} readonly />
      </div>
      <div class="control">
        <button class="button is-danger" on:click={() => deleteAnswer(i)}>
          <span class="icon">
            <i class="fas fa-trash-alt" />
          </span>
        </button>
      </div>
    </div>
  {/if}
{/each}

<!-- validate (add q and a to list) -->
<div class="field">
  <div class="control">
    <button class="button is-fullwidth is-success" on:click={addQ_A}>
      <span>
        <i class="fas fa-check" />
      </span>
    </button>
  </div>
</div>

<!-- Show Q&A (stuck :) -->
<aside class="menu">
  {#each questions_answers as q, i}
    <ul class="menu-list">
      <!-- show question -->
      <li>
        <span class="menu-label">{q.text_question}</span>
        <a class="delete" on:click={() => deleteQ_A(i)} />
      </li>
      <!-- show answers -->
      <li>
        {#each q.answers as a, j}
          <ul>
            <li>
              <div class="field has-addons">
                <div class="control">
                  <button class="button is-static is-small">{j + 1}</button>
                </div>
                <div class="control is-expanded">
                  <input
                    type="text"
                    class="input {direction} is-small"
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
  {:else}
    <div class="notification has-text-centered">No Questions and Answers Here ..!</div>
  {/each}
</aside>
