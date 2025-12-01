import { Checkbox, Image, Text, UnstyledButton } from "@mantine/core";
import { useUncontrolled } from "@mantine/hooks";
import styles from "./imageCheckbox.module.scss";

// Code mostly from https://ui.mantine.dev/category/inputs/

interface ImageCheckboxProps {
    checked?: boolean;
    disabled?: boolean;
    onChange?: (checked: boolean) => void;
    title: string;
    description: string;
    image: string;
}

export function ImageCheckbox({
    checked,
    disabled,
    onChange,
    title,
    description,
    className,
    image,
    ...others
}: ImageCheckboxProps &
    Omit<React.ComponentPropsWithoutRef<"button">, keyof ImageCheckboxProps>) {
    const [value, handleChange] = useUncontrolled({
        value: checked,
        finalValue: false,
        onChange,
    });

    return (
        <UnstyledButton
            {...others}
            onClick={() => handleChange(!value)}
            data-checked={value || undefined}
            className={styles.button}
        >
            <Image src={image} alt={title} w={40} h={40} />

            <div className={styles.body}>
                <Text c='dimmed' size='xs' lh={1} mb={5}>
                    {description}
                </Text>
                <Text fw={500} size='sm' lh={1}>
                    {title}
                </Text>
            </div>

            <Checkbox
                disabled={disabled}
                checked={value}
                onChange={() => {}}
                tabIndex={-1}
                styles={{ input: { cursor: "pointer" } }}
            />
        </UnstyledButton>
    );
}
