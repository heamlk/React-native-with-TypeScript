import { View } from 'react-native'
import { Text } from '../components/reusable'
import { Table, Row, Rows } from 'react-native-table-component'

export default function PrivacyPolicy() {
  const tableHead = ['Purpose', 'Why and how we use your information', 'Legal basis', 'Categories of information']

  const tableData = [
    [
      'Operating and administering the Services',
      'Providing and maintaining the content and functionality of the Services. Carrying out obligations arising from our contract with you. Creating your account and profile. Facilitating payments and transactions, including for the purchase of premium features, and managing your rewards. Responding to your inquiries, comments, feedback or questions, and troubleshooting. Managing our relationship with you, which includes sending administrative information to you relating to our Services.',
      'Contractual necessity',
      'Account information. Profile information. Messages and content. Interests and preferences. Payments, transactions, and rewards. Device and network data. Usage data.',
    ],
    [
      'Providing the core functionality of the Services',
      'Providing you personalized AI companion(s) and allowing you to personalize your profile, interests, and AI companion(s). Enabling you to have individualized and safe conversations and interactions with your AI companion(s), and allowing your AI companion(s) to learn from your interactions to improve your conversations. Syncing your BFFL.AI history across the devices you use to access the Services.',
      'Contractual necessity',
      'Account information. Profile information. Messages and content. Interests and preferences. Payments, transactions, and rewards. Device and network data. Usage data.',
    ],
    [
      'Monitoring and protecting the Services',
      'Preventing fraud, criminal activity, and misuse of our Services, and ensuring the security of our IT systems, architecture and networks (including testing, system maintenance, support, and hosting of data).',
      'Legitimate interests',
      'Account information. Profile information. Messages and content. Interests and preferences. Payments, transactions, and rewards. Device and network data. Usage data.',
    ],
    [
      'Analyzing trends in the use of the Services',
      'Aggregating, anonymizing, and deidentifying personal information. Analyzing the use and effectiveness of our Services. Improving and adding features to our Services. Developing our business and marketing strategies.',
      'Legitimate interests',
      'Account information. Profile information. Messages and content. Interests and preferences. Payments, transactions, and rewards. Device and network data. Usage data.',
    ],
    [
      'Marketing and advertising the Services',
      'Sending you information by email that we believe will be of interest to you, such as information about our Services, features, and surveys. Displaying and targeting advertisements about our Services on the internet.',
      'Legitimate interests. Consent, where required by applicable laws.',
      'Account information. Device and network data. Usage data.',
    ],
    [
      'Enforcing our agreements, complying with legal obligations, and defending against legal claims and disputes',
      'Enforcing and complying with our terms and policies. Protect our and others’ rights, privacy, safety, or property. Ensuring the integrity of our Services. Verifying the age of registered users. Defending against legal claims and disputes. Recovering payments due to us. Keeping records of transactions, and complying with legal process.',
      'Legitimate interests. Legal obligation.',
      'Account information. Profile information. Messages and content. Interests and preferences. Payments, transactions, and rewards. Device and network data. Usage data.',
    ],
  ]

  return (
    <View className='gap-[24px]'>
      <Text className='text-[32px] text-white'>Privacy Policy</Text>

      <Text className='text-[18px] text-white'>Last updated: August 8, 2024</Text>

      <Text className='text-[28px] text-white'>Welcome to BFFL.AI!</Text>

      <Text className='text-[18px] text-white'>BFFL.AI LLC (“BFFL.AI”, “we”, “us”, and/or “our”) operates the BFFL.AI website www.bffl.ai (the “Website”) and other related services (collectively, the “Services”).</Text>

      <Text className='text-[18px] text-white'>We are committed to protecting your privacy. This Privacy Policy describes how we collect, store, use, and share information through our Services.</Text>

      <Text className='text-[18px] text-white'>
        We care about the protection and confidentiality of your information. When you use the Services, you may provide information during your conversations with your BFFL.AI AI companion(s). We process this information only as described in this Privacy Policy, such as to allow you to have individualized and safe
        conversations and interactions with your AI companion(s) and to allow your AI companion(s) to learn from your interactions to improve your conversations. We may also use information about your visit to our Website to promote our Services, but we will never use or disclose the content of your BFFL.AI
        conversations for marketing or advertising purposes.
      </Text>

      <Text className='text-[18px] text-white'>Any terms we use in this Policy without defining them have the definitions given to them in our Terms of Service. If you have any questions, please contact us at privacy@bffl.ai.</Text>

      <Text className='text-[28px] text-white'>1. What information we collect</Text>

      <Text className='text-[24px] text-white'>A. Information you provide</Text>

      <Text className='text-[18px] text-white'>
        Through your use of the Services, you may provide us with the following information:
        <br />
        - Account information. This includes your name, email address, and password. If you choose to log in using another service, such as Google or Apple, we receive information about the service you used to log in and — depending on your chosen account settings with Google and Apple — details about you, including
        your name, email address, or unique user identifiers.
        <br />
        - Profile information. We ask you to provide your birth date, pronouns, and other personal information when you register for the Services.
        <br />
        - Messages and content. This includes the messages you send and receive through the Services, such as facts you may provide about you or your life, and any photos, videos, and voice and text messages you provide.
        <br />
        - Interests and preferences. You may select conversation preferences, such as topics you would like to discuss, and communication preferences, such as the times of day you like to use the Services. We also learn about your interests and your preferences over time through your use of the Services to personalize
        your conversations and the features of the Services.
        <br />- Payments, transactions, and rewards. When you make purchases through the Services, our third-party payment processor collects your payment information. We maintain a record of your purchases, the features you select, and the rewards you earn and use.
      </Text>

      <Text className='text-[24px] text-white'>B. Information we collect automatically</Text>

      <Text className='text-[18px] text-white'>
        We automatically log the following information about you, your computer or mobile device, your network, and your interactions over time with our Services and our communications:
        <br />
        - Device and network data. This includes your computer’s or mobile device’s operating system, manufacturer and model, browser, IP address, device and cookie identifiers, language settings, mobile device carrier, and general location information such as city, state, or geographic area.
        <br />
        - Usage data. This includes information about how you use the Services, such as your interactions with the Services, the links and buttons you click, and page visits.
        <br />
        - We use cookies, web beacons (e.g., pixel tags), and local storage technologies (e.g., HTML5) to collect some of this information. For more information on how we use these technologies, please visit our Cookie Policy.
        <br />- Our advertising partners may also use such technologies to collect limited information about your device and interactions with the Services, such as the links you click, pages you visit, IP address, advertising ID, and browser type, but they will never have access to your conversations with your BFFL.AI
        or any photos or other content you submit through the Services.
      </Text>

      <Text className='text-[28px] text-white'>2. How we use your information</Text>

      <Text className='text-[24px] text-white'>A. Use of your information</Text>

      <Text className='text-[18px] text-white'>We use your information for the following purposes:</Text>

      <Table borderStyle={{ borderWidth: 1, borderColor: '#3e2f57' }}>
        <Row data={tableHead} style={{ backgroundColor: '#291e3c' }} textStyle={{ color: 'white', fontWeight: '700', padding: 8, fontSize: 14 }} />
        <Rows data={tableData} textStyle={{ color: 'white', margin: 6, fontSize: 14, lineHeight: 18 }} />
      </Table>

      <Text className='text-[24px] text-white'>B. Sensitive information.</Text>

      <Text className='text-[18px] text-white'>The Services allow you to input information that may be sensitive and subject to special protections under applicable laws. This section explains how we use and protect sensitive information.</Text>

      <Text className='text-[18px] text-white'>
        Sensitive information you provide in your messages and content. In your conversations with your AI companion(s), you may choose to provide information about your religious views, sexual orientation, political views, health, racial or ethnic origin, philosophical beliefs, trade union membership, or other
        sensitive topics. By providing sensitive information, you consent to our use of it for the purposes set out in this Privacy Policy. Note, however, that we will not use your sensitive information – or any content of your BFFL.AI conversations – for marketing or advertising.
      </Text>

      <Text className='text-[28px] text-white'>3. How we share your information</Text>

      <Text className='text-[24px] text-white'>A. Service providers</Text>

      <Text className='text-[18px] text-white'>
        We share your information with companies and individuals that provide services on our behalf or help us operate the Services or our business (such as hosting, information technology, customer support, email delivery, and website analytics services). We also share information with companies that provide
        marketing services on our behalf, but we do not share the content of your BFFL.AI conversations for marketing or advertising purposes. For example, we may share your email address with marketing service providers to deliver our marketing emails to you on our behalf and to help us identify other individuals who
        may be interested in our Services.
      </Text>

      <Text className='text-[24px] text-white'>B. Professional advisors</Text>

      <Text className='text-[18px] text-white'>We may share information with professional advisors, such as lawyers, auditors, bankers, and insurers, where necessary in the course of the professional services that they render to us.</Text>

      <Text className='text-[24px] text-white'>C. Advertising partners</Text>

      <Text className='text-[18px] text-white'>
        We share information about visitors to our Website, such as the links you click, pages you visit, IP address, advertising ID, and browser type with advertising companies for interest-based advertising and other marketing purposes. Sharing this information allows us and our advertising partners to target and
        serve advertising to you and others. We will never share your BFFL.AI conversations or any photos or other content you provide within the Services with our advertising partners, or use such information for marketing or advertising purposes.
      </Text>

      <Text className='text-[24px] text-white'>D. Authorities and others</Text>

      <Text className='text-[18px] text-white'>We may share information with law enforcement, government authorities, and private parties, as we believe in good faith to be necessary or appropriate for the legal compliance and protection purposes described above in Section 2.A.</Text>

      <Text className='text-[24px] text-white'>E. Business transferees</Text>

      <Text className='text-[18px] text-white'>
        We may share information with acquirers and other relevant participants in business transactions (or negotiations for such transactions) involving a corporate divestiture, merger, consolidation, acquisition, reorganization, sale, or other disposition of all or any portion of the business or assets of, or equity
        interests in, BFFL.AI LLC (including, in connection with a bankruptcy or similar proceedings).
      </Text>

      <Text className='text-[28px] text-white'>4. How we secure your information</Text>

      <Text className='text-[18px] text-white'>We use a variety of industry-standard security technologies and procedures to help protect your data from unauthorized access, use, or disclosure.</Text>

      <Text className='text-[18px] text-white'>
        Your account is protected by a password for your privacy and security. You must prevent unauthorized access to your account and personal information by selecting and protecting your password appropriately and limiting access to your computer or device and browser by signing off after you have finished accessing
        your account.
      </Text>

      <Text className='text-[18px] text-white'>
        All transmitted data are encrypted during transmission. We use standard Secure Socket Layer (SSL) encryption that encodes information for such transmissions. All stored data are maintained on secure servers. Access to stored data is protected by multi-layered security controls, including firewalls, role-based
        access controls, and passwords.
      </Text>

      <Text className='text-[18px] text-white'>
        While we use reasonable commercial efforts to protect the data, no technology, data transmission, or system can be guaranteed to be 100% secure. In the event of a breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorized disclosure of, or access to your data, we will
        notify you as soon as we become aware of the issue.
      </Text>

      <Text className='text-[28px] text-white'>5. Where we store your information</Text>

      <Text className='text-[18px] text-white'>
        Our Services are operated from the United States of America. If you are located in another jurisdiction, please be aware that the information you provide to us may be transferred to, stored, and processed in the U.S.A., a jurisdiction in which the privacy laws may not be as comprehensive as those in the country
        where you reside or are a citizen.
      </Text>

      <Text className='text-[28px] text-white'>6. Data retention</Text>

      <Text className='text-[18px] text-white'>We will retain your personal information for only as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.</Text>

      <Text className='text-[18px] text-white'>
        To determine the appropriate retention period for personal information, we consider the amount, nature, and sensitivity of the personal information, the potential risk of harm from unauthorized use or disclosure of your personal information, the purposes for which we process your personal information and
        whether we can achieve those purposes through other means, and the applicable legal requirements.
      </Text>

      <Text className='text-[28px] text-white'>7. Your rights and choices</Text>

      <Text className='text-[24px] text-white'>A. Opt-out of marketing communications</Text>

      <Text className='text-[18px] text-white'>
        You may opt out of marketing-related emails and other communications by following the opt-out or unsubscribe instructions in the communications you receive from us or by contacting us as provided in the “Contact us” section below. You may continue to receive Services-related and other non-marketing emails from
        us.
      </Text>

      <Text className='text-[24px] text-white'>B. Opt-out of selling personal information and sharing for targeted advertising</Text>

      <Text className='text-[18px] text-white'>
        We share information with third-party advertising partners and allow them to collect information about your visit to our Website using cookies and other tracking technologies to display targeted advertising around the web as described in the “How we share your information” section above. Our disclosure of
        information to these partners may be considered a “sale” or “sharing” of personal information or “targeted advertising” under applicable laws. You can opt out of these disclosures and limit our use of tracking technologies as described in our Cookie Policy. In addition, some internet browsers can be configured
        to send “Do Not Track” signals to the online services that you visit. We currently do not respond to “Do Not Track” or similar signals. To find out more about “Do Not Track,” please visit http://www.allaboutdnt.com.
      </Text>

      <Text className='text-[24px] text-white'>C. Limit our use of sensitive personal information</Text>

      <Text className='text-[18px] text-white'>
        If you choose to provide sensitive personal information in your messages and content, we will use that information only to facilitate your conversation with your AI companion(s) and as described in the “Sensitive information” section above. If you do not want us to process your sensitive information for these
        purposes, please do not provide it. You may request that we delete information you have provided as set out in the “Personal information requests” section below.
      </Text>

      <Text className='text-[24px] text-white'>D. Personal information requests</Text>

      <Text className='text-[18px] text-white'>
        We also offer you choices that affect how we handle the personal information that we control. Depending on your location and the nature of your interactions with our Services, you may request the following in relation to personal information:
        <br />
        - Information about how we have collected and used personal information. We have made this information available to you without having to request it by including it in this Privacy Policy.
        <br />
        - Access to a copy of the personal information that we have collected about you. Where applicable, we will provide the information in a portable, machine-readable, readily usable format.
        <br />
        - Correction of personal information that is inaccurate or out of date.
        <br />
        - Deletion of personal information that we no longer need to provide the Services or for other lawful purposes. You can also delete your account by emailing us with a request.
        <br />
        - Withdrawal of consent, where we have collected and processed your personal information with your consent. Withdrawing your consent will not affect the lawfulness of any processing we conducted prior to your withdrawal, nor will it affect processing of your personal information conducted in reliance on lawful
        processing grounds other than consent.
        <br />
        - Additional rights, such as to object to and request that we restrict our use of personal information.
        <br />
        - To make a request, please contact us as provided in the “Contact us” section below. We may ask for specific information from you to help us confirm your identity. Depending on where you reside, you may be entitled to empower an authorized agent to submit requests on your behalf. We will require authorized
        agents to confirm their identity and authority, in accordance with applicable laws. You are entitled to exercise the rights described above free from discrimination.
        <br />- In some instances, your choices may be limited, such as where fulfilling your request would impair the rights of others, our ability to provide a service you have requested, or our ability to comply with our legal obligations and enforce our legal rights. If you are not satisfied with how we address
        your request, you may submit a complaint by contacting us as provided in the “Contact us” section below. Depending on where you reside, such as if you reside in the European Economic Area or United Kingdom, you may have the right to complain to a data protection regulator where you live or work, or where you
        feel a violation has occurred.
      </Text>

      <Text className='text-[24px] text-white'>E. Right to erasure (‘right to be forgotten’)</Text>

      <Text className='text-[18px] text-white'>
        You can request the deletion of your personal data. We are guided by principle of integrity and confidentiality measures, so to delete data please contact us by e-mail: privacy@bffl.ai. Please note that personal data that you have provided to us based on your consent will be deleted.
      </Text>

      <Text className='text-[28px] text-white'>8. Use of BFFL.AI by minors</Text>

      <Text className='text-[18px] text-white'>
        The Services are not intended for individuals under the age of 18. If we discover that minors under the age of 18 are using the Services, we will promptly block their access and delete their account. If you have reason to believe that a minor under the age of 18 has provided personal information to us through
        the Services, please contact us, and we will endeavor to delete that information from our databases.
      </Text>

      <Text className='text-[28px] text-white'>9. Changes to this Privacy Policy</Text>

      <Text className='text-[18px] text-white'>
        The Services and our business may change from time to time. As a result, at times it may be necessary for us to make changes to this Privacy Policy. We reserve the right to update or modify this Privacy Policy at any time and from time to time without prior notice. We encourage you to periodically review this
        page for the latest information on our privacy practices. This Privacy Policy was last updated on the date indicated above.
      </Text>

      <Text className='text-[28px] text-white'>10. Contact us</Text>

      <Text className='text-[18px] text-white'>You can contact us by emailing us at privacy@bffl.ai.</Text>
    </View>
  )
}
