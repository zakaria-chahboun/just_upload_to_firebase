<script>
  import { transport2 } from "./Store.js";

  // Image
  let image_file = [];
  let image_description_file = [];
  var reader = new FileReader();
  // Preview
  let image_preview = "./no-image-avaliable.jpg"; // just for preview :p
  let image_description_preview = "./no-image-avaliable.jpg"; // just for preview :p
  $: if (image_file[0]) {
    // to preview :p
    image_preview = URL.createObjectURL(image_file[0]);
  }
  $: if (image_description_file[0]) {
    // to preview :p
    image_description_preview = URL.createObjectURL(image_description_file[0]);
  }

  // Audio
  let audio_file = [];
  let audio_description_file = [];

  // ALL DATA TO SEND :)
  $: transport2.set({
    image_file,
    image_description_file,
    audio_file,
    audio_description_file
  });
</script>

<!-- Upload Image & Description -->
<div class="columns">
  <div class="column is-6">
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
            {image_file[0].name.substr(0, 21) + '...'}
          {:else}No image uploaded{/if}
        </span>
      </label>
    </div>
    <!-- Preview Image -->
    <figure class="image is-3by2">
      <img src={image_preview} alt="" />
    </figure>
  </div>
  <div class="column is-6">
    <!-- Upload image description -->
    <label class="label">Add Image Description</label>
    <div class="file has-name is-fullwidth">
      <label class="file-label">
        <input
          class="file-input"
          type="file"
          bind:files={image_description_file} />
        <span class="file-cta">
          <span class="file-icon">
            <i class="fas fa-upload" />
          </span>
          <span class="file-label">Choose an image</span>
        </span>
        <span class="file-name">
          {#if image_description_file && image_description_file[0]}
            {image_description_file[0].name.substr(0, 21) + '...'}
          {:else}No image description uploaded{/if}
        </span>
      </label>
    </div>
    <!-- Preview Image Description -->
    <figure class="image is-3by2">
      <img src={image_description_preview} alt="" />
    </figure>
  </div>
</div>

<!-- Upload Audio -->
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
<label class="label">Add Audio Description</label>
<div class="file has-name is-fullwidth">
  <label class="file-label">
    <input class="file-input" type="file" bind:files={audio_description_file} />
    <span class="file-cta">
      <span class="file-icon">
        <i class="fas fa-upload" />
      </span>
      <span class="file-label">Choose an audio description</span>
    </span>
    <span class="file-name">
      {#if audio_description_file && audio_description_file[0]}
        {audio_description_file[0].name}
      {:else}No audio description uploaded{/if}
    </span>
  </label>
</div>
