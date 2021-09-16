 <template>
  <container tag="main">
    <template #heading>The vault</template>
    <main>
      <div class="password" v-for="password in passwords" :key="password.id">
        <link-base :to="`/passwords/${password.id}`">
          {{ password.app }}
        </link-base>
      </div>
    </main>
  </container>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  async asyncData({ $axios, error }) {
    try {
      const { data: passwords } = await $axios.get("/passwords")
      return { passwords }
    } catch (e) {
      return error(e.response.data)
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *
</style>
