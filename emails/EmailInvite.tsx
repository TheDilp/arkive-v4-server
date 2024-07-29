import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface InviteUserEmailProps {
  project_name: string;
  image?: string;
  isRemoved: boolean;
}

export const EmailInvite = ({ project_name, image, isRemoved }: InviteUserEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        {isRemoved ? "You have been removed from an Arkive project by its owner" : "You've been invited to an Arkive project"}
      </Preview>
      <Tailwind>
        <Body className="bg-black my-auto mx-auto font-sans text-white">
          <Container className="border border-solid border-zinc-700 rounded my-[40px] mx-auto p-[20px] w-[465px] bg-zinc-900">
            <Section className="mt-[32px]">
              <Img
                src={image || "https://the-arkive-v3.nyc3.cdn.digitaloceanspaces.com/assets/Logo.webp"}
                width="96"
                height="auto"
                alt="The Arkive"
                className="my-0 mx-auto"
              />
            </Section>
            {isRemoved ? null : (
              <Heading className="text-white text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                Join <strong>{project_name}</strong>
                {project_name ? " on " : " "}
                <strong>the Arkive</strong>
              </Heading>
            )}
            {isRemoved ? null : <Text className="text-white text-[18px] leading-[24px]">Hello,</Text>}
            {isRemoved ? (
              <Text className="text-white text-[18px] leading-[24px]">
                You have been removed from the project <strong> {project_name} </strong> on
                <strong> the Arkive</strong>.
              </Text>
            ) : (
              <Text className="text-white text-[18px] leading-[24px]">
                you have been invited to {project_name ? "the" : "a"} project<strong> {project_name} </strong> on
                <strong> the Arkive</strong>.
              </Text>
            )}

            {isRemoved ? null : (
              <Section className="text-center mt-[32px] mb-[32px]">
                <Button
                  className="bg-[#000000] rounded text-white text-[12px] font-semibold no-underline text-center p-4"
                  href={"https://thearkive.app"}>
                  Join the Arkive
                </Button>
              </Section>
            )}

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
