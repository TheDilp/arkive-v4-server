import { Body, Button, Container, Head, Hr, Html, Img, Preview, Section, Tailwind, Text } from "@react-email/components";

import { getDateStringHoursFromNow } from "../utils/dateTimeUtils";

type GatewayType = "create" | "update";
type GatewayEntityType = "characters" | "blueprint_instances";

function getEntity(type: GatewayEntityType) {
  if (type === "characters") return "character";
  return "blueprint instance";
}

export const EmailGateway = ({
  type,
  link,
  title,
  code,
  gateway_type,
}: {
  type: GatewayEntityType;
  title: string;
  link: string;
  code: string;
  gateway_type: GatewayType;
}) => {
  return (
    <Html>
      <Head />
      <Preview>You have been granted gateway access to the Arkive</Preview>
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

            <Text className="text-white text-[18px] leading-[24px]">
              {gateway_type === "create"
                ? "Hello, you have been granted access to create a character in an Arkive project."
                : `Hello, you have been granted access to the {getEntity(type)} gateway for the {getEntity(type)} ${title}.`}
            </Text>
            <Text className="text-white text-[18px] leading-[24px]">Your access code is:</Text>
            <Text className="text-white text-[42px] leading-[24px] text-center">{code}</Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-[#16a34a] rounded text-white text-[20px] font-semibold no-underline text-center p-4"
                href={`${process.env.GATEWAY_CLIENT_URL}/${type}/${link}`}>
                Access {getEntity(type)} gateway
              </Button>
            </Section>
            <Text className="text-[12px] leading-[24px]">The access link will expire on {getDateStringHoursFromNow(6)}</Text>
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
