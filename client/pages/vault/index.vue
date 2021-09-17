 <template>
  <container tag="main">
    <template #heading>The vault</template>

    <main>
      <transition-group name="password" tag="div">
        <p
          class="password"
          v-for="password in $accessor.vault.passwords"
          :key="password.id"
        >
          <link-base :to="`/passwords/${password.id}`">
            {{ password.app }}
          </link-base>
        </p>
      </transition-group>
    </main>
  </container>
</template>

<script lang="ts">
import Vue from "vue"

export default Vue.extend({
  async beforeCreate() {
    await this.$accessor.vault.getPasswords()
  }
})
</script>

<style lang="sass" scoped>
@use "~/assets/scss/mixins" as *
</style>
