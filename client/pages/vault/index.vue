 <template>
  <container>
    <template #heading>The vault</template>
    <main>
      <container no-heading custom-max-width="600px">
        <form-generator
          v-bind="{ formFields }"
          :submitFunction="submit"
        ></form-generator>
      </container>

      <div>{{ passwords }}</div>
      <div class="password" v-for="password in passwords" :key="password._id">
        <link-base :to="`/passwords/${password._id}`">
          {{ password.title }}
        </link-base>
      </div>
    </main>
  </container>
</template>

<script lang="ts">
import Vue from "vue"
import { FormField } from "~/components/Form/Generator.vue"

export default Vue.extend({
  async asyncData({ $axios, error }) {
    try {
      const { data: passwords } = await $axios.get("/passwords")
      return { passwords }
    } catch (e) {
      return error(e.response.data)
    }
  },

  data: () => ({
    formFields: [
      {
        id: "title",
        type: "text",
        value: "",
        label: "title",
        props: { hint: "Facebook" }
      },
      {
        id: "password",
        type: "password",
        value: "",
        label: "password",
        props: { minLength: 2 }
      }
    ] as FormField[]
  }),

  methods: {
    submit() {
      this.$notify.error("the function isn't set yet")
    }
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *
</style>
