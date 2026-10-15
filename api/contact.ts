import { handleContact } from '../server/contact.js';

export default {
  fetch(request: Request) {
    return handleContact(request, process.env);
  },
};
