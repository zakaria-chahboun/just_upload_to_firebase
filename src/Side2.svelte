<script>
  import {transport2} from "./Store.js";

  // Image
  let image_file = [];
  var reader = new FileReader();
  let image = "./no-image-avaliable.jpg"; // just for preview :p
  $: if (image_file[0]) {
    // to preview :p
    image = URL.createObjectURL(image_file[0]);
  }
  let image_description = "";

  // Audio
  let audio_file = [];
  let audio_description = "";

  // ALL DATA TO SEND :)
  $:transport2.set({
    image_file,
    image_description,
    audio_file,
    audio_description
  });
</script>

<!-- Upload Image -->
<label class="label">Add Image</label>
<div class="file has-name is-fullwidth">
  <label class="file-label">
    <input class="file-input" type="file" bind:files={image_file} />
    <span class="file-cta">
      <span class="file-icon">
        <i class="fas fa-upload" />
      </span>
      <span class="file-label">Choose an image</span>
    </span>
    <span class="file-name">
      {#if image_file && image_file[0]}
        {image_file[0].name}
      {:else}No image uploaded{/if}
    </span>
  </label>
</div>
<!-- Preview image -->
<figure class="image is-3by2">
  <img src={image} alt="" />
</figure>

<!-- Add image description -->
<label class="label">Image description</label>
<div class="control">
  <textarea
    class="textarea"
    placeholder="add description here .."
    bind:value={image_description}
    rows="2" />
</div>

<!-- Upload Image -->
<label class="label">Add audio</label>
<div class="file has-name is-fullwidth">
  <label class="file-label">
    <input class="file-input" type="file" bind:files={audio_file} />
    <span class="file-cta">
      <span class="file-icon">
        <i class="fas fa-upload" />
      </span>
      <span class="file-label">Choose an audio</span>
    </span>
    <span class="file-name">
      {#if audio_file && audio_file[0]}
        {audio_file[0].name}
      {:else}No audio uploaded{/if}
    </span>
  </label>
</div>

<!-- Add audio description -->
<label class="label">Audio description</label>
<div class="control">
  <textarea
    class="textarea"
    placeholder="add description here .."
    bind:value={audio_description}
    rows="2" />
</div>
