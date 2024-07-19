import { Body, Button, Container, Head, Hr, Html, Img, Preview, Section, Tailwind, Text } from "@react-email/components";

export const EmailSignUp = ({ user_id }: { user_id: string }) => {
  return (
    <Html>
      <Head />
      <Preview>You have signed up for the Arkive</Preview>
      <Tailwind>
        <Body className="bg-black my-auto mx-auto font-sans text-white">
          <Container className="border border-solid border-zinc-700 rounded my-[40px] mx-auto p-[20px] w-[465px] bg-zinc-900">
            <Section className="mt-[32px]">
              <Img
                src={"https://the-arkive-v3.nyc3.cdn.digitaloceanspaces.com/assets/Logo.webp"}
                width="96"
                height="auto"
                alt="The Arkive"
                className="my-0 mx-auto"
              />
            </Section>

            <Text className="text-white text-[14px] leading-[24px]">
              Hello, you have successfully signed up for the Arkive. Please click the button below to confirm your account.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#16a34a] rounded text-white text-[12px] font-semibold no-underline text-center p-4"
                href={`${process.env.ARKIVE_SERVER_URL}/auth/email_confirm/${user_id}`}>
                Join the Arkive
              </Button>
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              If you were not expecting this email, you can safely ignore it.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
