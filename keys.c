#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <gmp.h>
#include <string.h>

int main(int argc, char *argv[])
{
    mpz_t x, y;
    mpz_init(x);
    mpz_init(y);
    mpz_t p, q;
    mpz_init(p);
    mpz_init(q);
    mpz_t n, phin;
    mpz_init(n);
    mpz_init(phin);

    mpz_t data;
    mpz_init(data);

    mpz_set_str(p, argv[1], 10);
    mpz_set_str(q, argv[2], 10);
    mpz_mul(n, p, q);

    mpz_sub_ui(p, p, 1);
    mpz_sub_ui(q, q, 1);
    mpz_mul(phin, p, q);
    mpz_t buff;
    mpz_init(buff);
    mpz_t e;
    mpz_init(e);
    mpz_set_ui(e, 17);
    for (; mpz_cmp_si(e, 100) <= 0; mpz_add_ui(e, e, 1))
    {
        mpz_gcd(buff, phin, e);
        if (mpz_cmp_si(buff, 1) == 0)
            break;
    }

    mpz_t k;
    mpz_init(k);
    mpz_set_ui(k, 1);
    mpz_t d;
    mpz_init(d);
    while (1)
    {
        mpz_add(k, k, phin);
        mpz_mod(buff, k, e);
        if (mpz_cmp_si(buff, 0) == 0)
        {
            mpz_fdiv_q(d, k, e);
            break;
        }
    }

    mpz_out_str(stdout, 10, e);
    printf(" ");
    mpz_out_str(stdout, 10, d);
    printf(" ");
    mpz_out_str(stdout, 10, n);
    mpz_clear(x);
    mpz_clear(y);
    mpz_clear(p);
    mpz_clear(q);
    mpz_clear(n);
    mpz_clear(phin);
    mpz_clear(data);
    mpz_clear(buff);
    mpz_clear(e);
    mpz_clear(k);
    mpz_clear(d);
    return 0;
}