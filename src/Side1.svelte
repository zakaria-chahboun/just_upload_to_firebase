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

  // Types: array
  let types_collection = "/typesQuestion"; // for firebase
  let _types; // just for firebase
  let type; // Chosen type
  let tags = []; // arrayof objects: {id, text}

  // Languages
  export let lang = "ar"; //by default

  /*** functions ***/
  function addAnswer() {
    let a = { text, isCorrect };
    answers = [...answers, a];
    text = "";
  }
  function deleteAnswer(index) {
    answers.splice(index, 1);
    answers = answers;
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
    question,
    question_description,
    answers,
    tags,
    lang
  });


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
  <div class="control">
    <a
      href="/types"
      class="button has-tooltip-left has-tooltip-active"
      data-tooltip="To Manage Types Click Here">
      <span class="icon">
        <i class="fas fa-list" />
      </span>
    </a>
  </div>
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
        <a href=":0" class="tag is-success ">{e.text}</a>
        <a href=":0" class="tag is-delete" on:click={() => deleteTag(i)} />
      </div>
    </div>
  {:else}
    <div class="notification has-text-centered">NO TYPES IS HERE!</div>
  {/each}
</div>

<!-- Add answer -->
<label class="label">Add answers</label>
<div class="field has-addons">
  <div class="control has-icons-left is-expanded">
    <input
      type="text"
      class="input {direction}"
      bind:value={text}
      placeholder="add somthing here .." />
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
