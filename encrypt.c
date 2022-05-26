#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <gmp.h>
#include <string.h>

void powMod(mpz_t a, mpz_t b, mpz_t n, mpz_t x, mpz_t y)
{
    mpz_t buf;
    mpz_init(buf);
    mpz_set_ui(x, 1);
    mpz_set(y, a);
    while (mpz_cmp_si(b, 0) > 0)
    {
        mpz_set(buf, b);
        mpz_mod_ui(buf, b, 2);
        if (mpz_cmp_si(buf, 1) == 0)
        {
            mpz_mul(buf, x, y);
            mpz_mod(x, buf, n);
        }
        mpz_mul(buf, y, y);
        mpz_mod(y, buf, n);
        mpz_fdiv_q_ui(b, b, 2);
    }
    mpz_mod(x, x, n);
    mpz_clear(buf);
}

int main(int argc, char *argv[])
{
    mpz_t data, e, n, x, y, cipher;
    int count = argc;
    int i = 3;
    mpz_init(data);
    mpz_init(e);
    mpz_init(n);
    mpz_init(x);
    mpz_init(y);
    mpz_init(cipher);
    while (count-- > 3)
    {
        mpz_set_str(data, argv[i], 10);
        mpz_set_str(e, argv[1], 10);
        mpz_set_str(n, argv[2], 10);
        powMod(data, e, n, x, y);
        mpz_set(cipher, x);
        mpz_out_str(stdout, 10, cipher);
        printf(" ");
        i++;
    }
    return 0;
}