import { Text } from "@mantine/core";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";

/**
 * Example requirement subcomponent found in Mantine docs:
 * https://mantine.dev/core/password-input/#strength-meter-example
 */
export const requirements = [
    { re: /.{8,}/, label: "At least 8 characters" },
    { re: /.{0,120}$/, label: "At most 120 characters" },
    { re: /[0-9]/, label: "Includes number" },
    { re: /[a-z]/, label: "Includes lowercase letter" },
    { re: /[A-Z]/, label: "Includes uppercase letter" },
    {
        re: /[!#$%&()*+,-.:;<=>?@^_~]/,
        label: "Includes symbol",
    },
];

function PasswordRequirement({
    meets,
    label,
}: {
    meets: boolean;
    label: string;
}) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                color: meets ? "teal" : "red",
                marginTop: 7,
            }}
        >
            {meets ? (
                <CheckIcon width={14} height={14} />
            ) : (
                <Cross1Icon width={14} height={14} />
            )}
            <Text ml={10} size='sm'>
                {label}
            </Text>
        </div>
    );
}

export default function PasswordRequirements({
    password,
    isDirty,
}: {
    password: string;
    isDirty: boolean;
}) {
    return (
        <div>
            {requirements.map((requirement, index) => (
                <PasswordRequirement
                    key={index}
                    label={requirement.label}
                    meets={requirement.re.test(password) && isDirty}
                />
            ))}
        </div>
    );
}
