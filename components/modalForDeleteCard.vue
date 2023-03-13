<template>
  <div class="modal">
    <div class="modalText">
      <h3>Are you sure you want to delete this card?</h3>
      <button class="confirm" @click="confirmDelete">Yes</button>
      <button class="close" @click="closeModal">
        <span class="vertical"></span>
        <span class="horizontal"></span>
      </button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    closeModal() {
      this.$emit("close");
    },
    confirmDelete() {
      this.$emit("confirmDelete");
    },
  },
};
</script>
<style lang="scss">
.modal {
  position: relative;
  background: linear-gradient(
    180deg,
    #d6eef3 100%,
    rgba(172, 190, 193, 0) 176.61%
  );
  box-shadow: 5px 5px 6px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  max-width: 500px;
  text-align: center;
  padding: 16px;

  .confirm {
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    background: linear-gradient(
      180deg,
      #ffffff 0%,
      rgba(172, 190, 193, 0) 176.61%
    );
    filter: drop-shadow(5px 5px 6px rgba(0, 0, 0, 0.3));
    border-radius: 8px;
  }

  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: 0.2s;
    transform: rotate(45deg);

    &:hover {
      transform: rotate(180deg);
    }

    .horizontal {
      display: block;
      width: 20px;
      height: 2px;
      background: #000;
    }

    .vertical {
      display: block;
      height: 20px;
      width: 2px;
      background: #000;
      transform: translateX(11px);
    }
  }
}
</style>
