export abstract class Documento {
    static mask: string = "";

    static strip(value: string): string {
        return value.replace(/\D/g, "");
    }
    static format(value: string): string {
        return value;
    }

    static isValid(value: string): boolean {
        return value.length > 0;
    }
}

export class CPF extends Documento {
    static mask: string = "000.000.000-00";

    static format(value: string): string {
        const stripped = this.strip(value);

        if (stripped.length !== 11) return value;

        return stripped.replace(
            /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
            "$1.$2.$3-$4"
        );
    }

    static isValid(value: string): boolean {
        const cpf = this.strip(value);

        if (!cpf || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            return false;
        }

        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }

        let rest = (sum * 10) % 11;
        if (rest === 10 || rest === 11) rest = 0;
        if (rest !== parseInt(cpf.charAt(9))) return false;

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }

        rest = (sum * 10) % 11;
        if (rest === 10 || rest === 11) rest = 0;

        return rest === parseInt(cpf.charAt(10));
    }
}
