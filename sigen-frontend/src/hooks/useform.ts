import { useState } from "react";

type ValidatorFn<T> = (value: T[keyof T], values: T) => string | undefined;

type Validators<T> = Partial<Record<keyof T, ValidatorFn<T>[]>>;

export const validators = {
    required: (msg = "Campo obrigatório") =>
        <T>(v: T[keyof T], _values: T) =>
            v === undefined || v === null || v === "" ? msg : undefined,

    minLength: (min: number, msg?: string) =>
        <T>(v: T[keyof T], _values: T) =>
            typeof v === "string" && v.length < min
                ? msg ?? `Mínimo ${min} caracteres`
                : undefined,

    equal: (compare: string, msg?: string) =>
        <T>(v: T[keyof T], _values: T) =>
            v !== compare ? msg : undefined,

    equalField: <T>(otherField: keyof T, msg?: string): ValidatorFn<T> =>
        (v, values) =>
            v !== values[otherField]
                ? msg ?? "Valores não coincidem"
                : undefined,
    condition: <T, K extends keyof T>(
        predicate: (value: T[K]) => boolean,
        msg?: string
    ): ValidatorFn<T> => (value, _values) =>
            predicate(value as T[K]) ? undefined : msg ?? "Valor inválido",
    isNumber: (msg = "Deve ser um número") =>
        <T>(v: T[keyof T], _values: T) =>
            typeof v === "number" || (!isNaN(Number(v)) && v !== "") ? undefined : msg,


};


export function useForm<T extends Record<string, any>>(initialValues: T, validators?: Validators<T>) {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

    const runValidators = (field: keyof T, value: any): string | undefined => {
        const fieldValidators = validators?.[field];
        if (!fieldValidators) return undefined;

        for (const validator of fieldValidators) {
            const error = validator(value, values);
            if (error) return error;
        }
        return undefined;
    };

    const handleChange = <K extends keyof T>(field: K, value: T[K]) => {
        setValues((prev) => {
            const newValues = { ...prev, [field]: value };
            const error = runValidators(field, value);
            setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
            return newValues;
        });
    };

    const validateField = (field: keyof T): void => {
        const value = values[field];
        const error = runValidators(field, value);
        setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    };

    const setFieldError = (field: keyof T, message: string) => {
        setErrors((prev) => ({ ...prev, [field]: message }));
    };

    const resetForm = () => {
        setValues(initialValues);
        setErrors({});
    };

    const validateForm = (): boolean => {
        if (!validators) return true;
        let isValid = true;
        const newErrors: Partial<Record<keyof T, string>> = {};

        for (const field in validators) {
            const fieldKey = field as keyof T;
            const value = values[fieldKey];
            const error = runValidators(fieldKey, value);
            if (error) {
                newErrors[fieldKey] = error;
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    return {
        values,
        errors,
        handleChange,
        setFieldError,
        resetForm,
        validateForm,
        setValues,
        runValidators,
        validateField,
    };
}
