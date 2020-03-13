<script>
  import { firebase } from "./firebase.js";
  import { FirebaseApp, Doc, Collection } from "sveltefire";

  // firebase
  let types_collection = "/typesQuestion";
  let question_root = "/questions/questionsCollection";

  // langs
  export let lang = "ar"; // by default
</script>

<!-- To choose question langs -->

<table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
  <thead>
    <tr>
      <th>Pos</th>
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

  <tbody>
    <tr>
      <td>f</td>
      <td>f</td>
      <td>f</td>
      <td>f</td>
      <td>f</td>
      <td>f</td>
      <td>f</td>
      <td>f</td>
      <td>f</td>
      <td>f</td>
    </tr>
  </tbody>
</table>
