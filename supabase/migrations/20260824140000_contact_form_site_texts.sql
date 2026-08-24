-- Copy for the contact modal (opened from the "ctaMail" button on Home) and
-- its submit endpoint, added together in the same issue. Follows the same
-- site_texts pattern as existing copy -- editable via the inline admin UI.

insert into public.site_texts (key, value_en, value_de) values
  ('contactTitle', 'Get in touch', 'Kontakt aufnehmen'),
  ('contactIntro', 'Drop me a message and I''ll get back to you.', 'Schreib mir eine Nachricht, ich melde mich zurück.'),
  ('contactNameLabel', 'Name', 'Name'),
  ('contactEmailLabel', 'Email', 'E-Mail'),
  ('contactMessageLabel', 'Message', 'Nachricht'),
  ('contactSubmit', 'Send message', 'Nachricht senden'),
  ('contactSubmitting', 'Sending…', 'Wird gesendet…'),
  ('contactSuccess', 'Thanks! Your message is on its way.', 'Danke! Deine Nachricht ist unterwegs.'),
  ('contactErrorGeneric', 'Something went wrong. Please try again or email me directly.', 'Etwas ist schiefgelaufen. Bitte versuch es erneut oder schreib mir direkt eine E-Mail.'),
  ('contactErrorValidation', 'Please check your details and try again.', 'Bitte überprüfe deine Angaben und versuche es erneut.'),
  ('contactErrorRateLimit', 'Too many messages sent. Please try again later.', 'Zu viele Nachrichten gesendet. Bitte versuch es später erneut.'),
  ('contactOrEmail', 'or email me directly at', 'oder schreib mir direkt eine E-Mail an')
on conflict (key) do nothing;
