<?php
// Copy this file to the folder ABOVE public_html on Hostinger and name it
// lead-config.php, e.g.
//   /home/u123456789/domains/aspireventuresrealty.in/lead-config.php
// (hPanel → Files → File Manager). Never put this file in public_html or GitHub.
return [
    // hPanel → Databases → MySQL Databases
    'db_host' => 'localhost',
    'db_name' => 'u123456789_leads',
    'db_user' => 'u123456789_leads',
    'db_pass' => 'DATABASE-PASSWORD-HERE',

    // Where new-enquiry alerts are sent (comma-separate several addresses)
    'notify_to' => 'aspirerealty001@gmail.com',
    // Must be a mailbox on this domain (hPanel → Emails)
    'mail_from' => 'info@aspireventuresrealty.in',

    // Password for https://aspireventuresrealty.in/leads/
    'admin_password' => 'CHOOSE-A-STRONG-PASSWORD',
];
