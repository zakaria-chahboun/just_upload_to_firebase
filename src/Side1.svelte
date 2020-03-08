<script>
  import { transport1 } from "./Store.js";

  //Question
  let question = "";
  let question_description = "";

  // Answers
  let text = "";
  let isCorrect = false;
  let answers = [];

  // Types: array
  let types = [];
  for (let i = 0; i < 10; i++) {
    types[i] = `type${i + 1}`;
  }
  // Chosen type
  let type = "type1"; //by default

  // Languages
  let lang = "ar"; //by default

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

  // ALL DATA TO SEND :)
  $:transport1.set({
    question,
    question_description,
    answers,
    type,
    lang
  });
</script>

<!-- To choose question langs -->
<label class="label">Choose Language</label>
<div class="control">
  <label class="radio">
    <input type="radio" name="lang" checked bind:group={lang} value="ar" />
    Arabic
  </label>
  <label class="radio">
    <input type="radio" name="lang" bind:group={lang} value="en" />
    English
  </label>
  <label class="radio">
    <input type="radio" name="lang" bind:group={lang} value="fr" />
    French
  </label>
</div>
<br />

<!-- Add question -->
<label class="label">Add question</label>
<div class="field">
  <div class="control has-icons-left is-expanded">
    <input
      type="text"
      class="input "
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
    class="textarea has-fixed-size"
    placeholder="add description here .."
    bind:value={question_description} />
</div>
<br />

<!-- Types -->
<label class="label">Choose Type</label>
<div class="control">
  <div class="select is-fullwidth">
    <select bind:value={type}>
      {#each types as e}
        <option value={e}>{e}</option>
      {/each}
    </select>
  </div>
</div>
<br />

<!-- Add answer -->
<label class="label">Add answers</label>
<div class="field has-addons">
  <div class="control has-icons-left is-expanded">
    <input
      type="text"
      class="input "
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
        <input type="text" class="input" value={text} readonly />
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
