<template>
  <footer class="px-8 pt-16 pb-6 border-t-sm border-gray-darkest">
    <div class="lg:flex text-gray-darkest">
      <div class="flex flex-wrap flex-1 items-start">
        <div class="w-1/2 sm:w-1/4 sm:mr-8">
          <roa-logo class="mb-16" />
          <address class="paragraph hidden sm:block">
            <p>Wattgasse 48</p>
            <p>1170 Vienna</p>
            <p>Austria</p>
          </address>
        </div>
        <div class="-ml-3 sm:hidden w-1/2 flex flex-wrap flex-shrink">
          <roa-icon-link
            icon="instagram"
            muted
            href="https://www.instagram.com/returnonart.official"
          >
            Instagram
          </roa-icon-link>
          <roa-icon-link
            icon="linked-in"
            muted
            href="https://www.linkedin.com/company/return-on-art/"
          >
            Linkedin
          </roa-icon-link>
          <roa-icon-link
            icon="pinterest"
            muted
            href="https://www.pinterest.at/Returnonart/"
          >
            Linkedin
          </roa-icon-link>
          <roa-icon-button icon="mail" muted @click="contactModalOpen = true">
            Contact
          </roa-icon-button>
          <roa-modal v-if="contactModalOpen" @close="contactModalOpen = false">
            <slot name="contact-form"></slot>
          </roa-modal>
        </div>
        <nav class="sm:flex-1 sm:mx-8 w-1/2 sm:w-auto">
          <p class="small-caps mb-4">Discover art</p>
          <ul class="paragraph">
            <li>
              <a class="my-1 py-1 inline-block" href="/artworks">Artworks</a>
            </li>
            <li>
              <a class="my-1 py-1 inline-block" href="/artists">Artists</a>
            </li>
            <li>
              <a class="my-1 py-1 inline-block" href="/collections">
                Collections
              </a>
            </li>
            <li>
              <a class="my-1 py-1 inline-block" href="/match">Art match</a>
            </li>
          </ul>
        </nav>
        <nav class="sm:flex-1 sm:mx-8 w-1/2 sm:w-auto">
          <p class="small-caps mb-4">Learn more</p>
          <ul class="paragraph">
            <li>
              <a class="my-1 py-1 inline-block" href="/about">About us</a>
            </li>
            <li>
              <a
                class="my-1 py-1 inline-block"
                href="/frequently-asked-questions"
                >FAQ</a
              >
            </li>
            <li>
              <a class="my-1 py-1 inline-block" href="/contact">Contact us</a>
            </li>
            <li>
              <a
                class="my-1 py-1 inline-block"
                href="https://at.linkedin.com/company/return-on-art"
                >Careers</a
              >
            </li>
          </ul>
        </nav>
      </div>
      <div class="sm:flex w-full lg:w-1/3 lg:block mt-8 lg:mt-0 lg:ml-8">
        <div
          v-if="withPrivateView"
          class="lg:mb-4 w-full sm:w-1/4 lg:w-auto mr-16 lg:mr-0"
        >
          <p class="small-caps mb-4">Exclusive Access</p>
          <p class="paragraph"><a href="/private-view">Private view</a></p>
        </div>

        <div
          class="lg:w-full sm:w-2/3 mt-4 sm:mt-0"
          v-if="!this.$auth.loggedIn || !this.$auth.currentUser.newsletter"
        >
          <p class="small-caps mb-4">Newsletter</p>
          <newsletter-subscription-form
            class="w-full"
            :user-id="mailchimpUserId"
            :list-id="mailchimpListId"
          ></newsletter-subscription-form>
        </div>
      </div>
    </div>
    <div
      class="
        lg:flex
        justify-between
        flex-row-reverse
        w-full
        mt-4
        sm:mt-16
        items-center
      "
    >
      <div class="-ml-3 lg:ml-0 hidden sm:flex">
        <roa-icon-link
          icon="instagram"
          href="https://www.instagram.com/returnonart.official"
          muted
        >
          Instagram
        </roa-icon-link>
        <roa-icon-link
          icon="linked-in"
          href="https://www.linkedin.com/company/return-on-art/"
          muted
        >
          Linkedin
        </roa-icon-link>
        <roa-icon-link
          icon="pinterest"
          href="https://www.pinterest.at/Returnonart/"
          muted
        >
          Linkedin
        </roa-icon-link>
        <roa-icon-button icon="mail" @click="contactModalOpen = true" muted>
          Contact
        </roa-icon-button>
        <roa-modal v-if="contactModalOpen" @close="contactModalOpen = false">
          <slot name="contact-form"></slot>
        </roa-modal>
      </div>
      <p class="paragraph text-gray text-center sm:text-left mt-4 lg:mt-0">
        <a class="inline-block mr-8" href="/privacy-policy">Privacy policy</a>
        <a href="/terms">Terms &amp; conditions</a>
      </p>
      <address class="paragraph mt-16 text-center sm:hidden text-gray-darkest">
        <p>Wattgasse 48 • 1170 • Vienna • Austria</p>
      </address>
      <p
        class="
          paragraph
          uppercase
          text-gray text-center
          sm:text-left
          mt-4
          lg:mt-0
        "
      >
        &copy;{{ new Date().getFullYear() }} Return on Art
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  props: {
    mailchimpUserId: { type: String, required: true },
    mailchimpListId: { type: String, required: true },
    withPrivateView: { type: Boolean, default: false },
  },
  data() {
    return {
      contactModalOpen: false,
    };
  },
};
</script>