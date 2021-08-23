 <template>
  <container>
    <template #heading>tags</template>
    <box tag="main">
      <div>{{ tags }}</div>
      <div class="tag" v-for="tag in tags" :key="tag._id">
        <link-base :to="`/tags/${tag._id}`">
          {{ tag.tag }}
        </link-base>
      </div>
      <link-button to="/tags/add">Add new tag</link-button>
    </box>
  </container>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  async asyncData({ $axios, error }) {
    try {
      const { data: tags } = await $axios.get("/tags")
      return { tags }
    } catch (e) {
      return error(e.response.data)
    }
  }
})
</script>
