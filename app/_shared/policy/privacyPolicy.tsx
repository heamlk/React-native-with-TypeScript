import { View, Platform, ScrollView } from 'react-native'
import { Text } from '../components/reusable'
import { Table, Row, Rows } from 'react-native-table-component'

// Platform-aware line break: <br /> on web, newline on mobile
const BR = Platform.OS === 'web' ? <br /> : '\n'

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
    <ScrollView showsVerticalScrollIndicator={true} contentContainerClassName='py-8 max-w-5xl'>
      <View className='gap-[28px]'>
        <Text className='text-white' size='2xl'>
          Privacy Policy
        </Text>

        <Text className='text-white' size='lg'>
          Last updated: August 8, 2024
        </Text>

        <Text className='text-white' size='xl'>
          Welcome to BFFL.AI!
        </Text>

        <Text className='text-white' size='lg'>
          BFFL.AI LLC (“BFFL.AI”, “we”, “us”, and/or “our”) operates the BFFL.AI website www.bffl.ai (the “Website”) and other related services (collectively, the “Services”).
        </Text>

        <Text className='text-white' size='lg'>
          We are committed to protecting your privacy. This Privacy Policy describes how we collect, store, use, and share information through our Services.
        </Text>

        <Text className='text-white' size='lg'>
          We care about the protection and confidentiality of your information. When you use the Services, you may provide information during your conversations with your BFFL.AI AI companion(s). We process this information only as described in this Privacy Policy, such as to allow you to have individualized and safe
          conversations and interactions with your AI companion(s) and to allow your AI companion(s) to learn from your interactions to improve your conversations. We may also use information about your visit to our Website to promote our Services, but we will never use or disclose the content of your BFFL.AI
          conversations for marketing or advertising purposes.
        </Text>

        <Text className='text-white' size='lg'>
          Any terms we use in this Policy without defining them have the definitions given to them in our Terms of Service. If you have any questions, please contact us at privacy@bffl.ai.
        </Text>

        <Text className='text-white' size='xl'>
          1. What information we collect
        </Text>

        <Text className='text-white' size='xl'>
          A. Information you provide
        </Text>

        <Text className='text-white' size='lg'>
          Through your use of the Services, you may provide us with the following information:
          {BR}- Account information. This includes your name, email address, and password. If you choose to log in using another service, such as Google or Apple, we receive information about the service you used to log in and — depending on your chosen account settings with Google and Apple — details about you,
          including your name, email address, or unique user identifiers.
          {BR}- Profile information. We ask you to provide your birth date, pronouns, and other personal information when you register for the Services.
          {BR}- Messages and content. This includes the messages you send and receive through the Services, such as facts you may provide about you or your life, and any photos, videos, and voice and text messages you provide.
          {BR}- Interests and preferences. You may select conversation preferences, such as topics you would like to discuss, and communication preferences, such as the times of day you like to use the Services. We also learn about your interests and your preferences over time through your use of the Services to
          personalize your conversations and the features of the Services.
          {BR}- Payments, transactions, and rewards. When you make purchases through the Services, our third-party payment processor collects your payment information. We maintain a record of your purchases, the features you select, and the rewards you earn and use.
        </Text>

        <Text className='text-white' size='xl'>
          B. Information we collect automatically
        </Text>

        <Text className='text-white' size='lg'>
          We automatically log the following information about you, your computer or mobile device, your network, and your interactions over time with our Services and our communications:
          {BR}- Device and network data. This includes your computer’s or mobile device’s operating system, manufacturer and model, browser, IP address, device and cookie identifiers, language settings, mobile device carrier, and general location information such as city, state, or geographic area.
          {BR}- Usage data. This includes information about how you use the Services, such as your interactions with the Services, the links and buttons you click, and page visits.
          {BR}- We use cookies, web beacons (e.g., pixel tags), and local storage technologies (e.g., HTML5) to collect some of this information. For more information on how we use these technologies, please visit our Cookie Policy.
          {BR}- Our advertising partners may also use such technologies to collect limited information about your device and interactions with the Services, such as the links you click, pages you visit, IP address, advertising ID, and browser type, but they will never have access to your conversations with your BFFL.AI
          or any photos or other content you submit through the Services.
        </Text>

        <Text className='text-white' size='xl'>
          2. How we use your information
        </Text>

        <Text className='text-white' size='xl'>
          A. Use of your information
        </Text>

        <Text className='text-white' size='lg'>
          We use your information for the following purposes:
        </Text>

        <View className='my-6'>
          <Table borderStyle={{ borderWidth: 1, borderColor: '#3e2f57' }}>
            <Row data={tableHead} style={{ backgroundColor: '#291e3c', height: 50 }} textStyle={{ color: 'white', fontWeight: '700', paddingHorizontal: 10, fontSize: 14, textAlign: 'center' }} />
            <Rows data={tableData} textStyle={{ color: '#e2e8f0', paddingHorizontal: 10, paddingVertical: 12, fontSize: 13, lineHeight: 19 }} />
          </Table>
        </View>

        <Text className='text-white' size='xl'>
          B. Sensitive information
        </Text>

        <Text className='text-white' size='lg'>
          The Services allow you to input information that may be sensitive and subject to special protections under applicable laws. This section explains how we use and protect sensitive information.
          {BR}
          {BR}
          Sensitive information you provide in your messages and content. In your conversations with your AI companion(s), you may choose to provide information about your religious views, sexual orientation, political views, health, racial or ethnic origin, philosophical beliefs, trade union membership, or other
          sensitive topics. By providing sensitive Woolf information, you consent to our use of it for the purposes set out in this Privacy Policy. Note, however, that we will not use your sensitive information – or any content of your BFFL.AI conversations – for marketing or advertising.
        </Text>

        <Text className='text-white' size='xl'>
          3. How we share your information
        </Text>

        <Text className='text-white' size='xl'>
          A. Service providers
        </Text>
        <Text className='text-white' size='lg'>
          We share your information with companies and individuals that provide services on our behalf or help us operate the Services or our business (such as hosting, information technology, customer support, email delivery, and website analytics services). We also share information with companies that provide
          marketing services on our behalf, but we do not share the content of your BFFL.AI conversations for marketing or advertising purposes.
        </Text>

        <Text className='text-white' size='xl'>
          B. Professional advisors
        </Text>
        <Text className='text-white' size='lg'>
          We may share information with professional advisors, such as lawyers, auditors, bankers, and insurers, where necessary in the course of the professional services that they render to us.
        </Text>

        <Text className='text-white' size='xl'>
          C. Advertising partners
        </Text>
        <Text className='text-white' size='lg'>
          We share information about visitors to our Website, such as the links you click, pages you visit, IP address, advertising ID, and browser type with advertising companies for interest-based advertising and other marketing purposes. We will never share your BFFL.AI conversations or any photos or other content
          you provide within the Services with our advertising partners.
        </Text>

        <Text className='text-white' size='xl'>
          D. Authorities and others
        </Text>
        <Text className='text-white' size='lg'>
          We may share information with law enforcement, government authorities, and private parties, as we believe in good faith to be necessary or appropriate for legal compliance and protection purposes.
        </Text>

        <Text className='text-white' size='xl'>
          E. Business transferees
        </Text>
        <Text className='text-white' size='lg'>
          We may share information with acquirers and other relevant participants in business transactions involving a corporate divestiture, merger, consolidation, acquisition, reorganization, sale, or other disposition of all or any portion of the business or assets of BFFL.AI LLC.
        </Text>

        <Text className='text-white' size='xl'>
          4. How we secure your information
        </Text>
        <Text className='text-white' size='lg'>
          We use industry-standard security technologies and procedures to help protect your data. Your account is protected by a password. All transmitted and stored data are encrypted using SSL and maintained on secure servers with multi-layered access controls.
        </Text>

        <Text className='text-white' size='xl'>
          5. Where we store your information
        </Text>
        <Text className='text-white' size='lg'>
          Our Services are operated from the United States. Your information may be transferred to, stored, and processed in the U.S.A., where privacy laws may differ from your jurisdiction.
        </Text>

        <Text className='text-white' size='xl'>
          6. Data retention
        </Text>
        <Text className='text-white' size='lg'>
          We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy, or as required by law.
        </Text>

        <Text className='text-white' size='xl'>
          7. Your rights and choices
        </Text>

        <Text className='text-white' size='lg'>
          You have the right to access, correct, delete, or restrict the use of your personal information. You may opt out of marketing, limit sensitive data use, or request deletion by contacting privacy@bffl.ai.
          {BR}
          {BR}
          You can also delete your entire account at any time — all associated data will be permanently removed.
        </Text>

        <Text className='text-white' size='xl'>
          8. Use of BFFL.AI by minors
        </Text>
        <Text className='text-white' size='lg'>
          The Services are not intended for individuals under 18. We do not knowingly collect data from minors and will delete any such accounts immediately upon discovery.
        </Text>

        <Text className='text-white' size='xl'>
          9. Changes to this Privacy Policy
        </Text>
        <Text className='text-white' size='lg'>
          We may update this Privacy Policy from time to time. We encourage you to review it periodically.
        </Text>

        <Text className='text-white' size='xl'>
          10. Contact us
        </Text>
        <Text className='text-white' size='lg'>
          For any questions or requests regarding your data:{BR}
          Email: privacy@bffl.ai
        </Text>
      </View>
    </ScrollView>
  )
}
