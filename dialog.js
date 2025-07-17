export default class Dialog {
  constructor() {
    this.createDialog();
  }

  createDialog() {
    this.dialog = document.createElement('dialog');
    this.dialog.setAttribute('id', 'vertical-tabs-dialog');
    this.dialog.setAttribute('class', 'vertical-tabs-dialog');
    this.dialog.setAttribute('open', false);
    this.dialog.innerHTML = `
      <form method="dialog">
        <p>Are you sure you want to close all tabs?</p>
        <menu>
          <button id="cancel" type="reset">Cancel</button>
          <button id="ok" type="submit">OK</button>
        </menu>
      </form>
    `;
    document.body.appendChild(this.dialog);
  }

  showModal() {
    this.dialog.showModal();
  }
  closeModal() {
    this.dialog.close();
  }

  close() {
    this.dialog.close();
  }

}