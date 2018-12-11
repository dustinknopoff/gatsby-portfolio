---
tag: rust
title: Bashdoc - Parsing with Nom
link: https://github.com/dustinknopoff/bashdoc/tree/0.2.0
date: 2018-12-10
---

> Part 3 of the unintended Bashdoc series.

> Read the earlier posts: [part 1](../../rust/bashdoc/) and [part 2](../../rust/bashdoc2/)

Since October, my interest in rust has gone from curiosity to "what can I make next in Rust." One of the things I'd discovered is [nom](https://crates.io/crates/nom), a library for building parsers. Since it's in Rust it's super fast. Their example parsers include things like CSV, MP3, PHP, and more. Looking at my own code, the repeated use of `split_whitespace()` seems costly and naive. Why iterate through different pieces of the text over and over again to get the structure I require when I can do it one pass?

## Nom

Nom primarily utilizes the `macros` in Rust. These are meta-functions that are signified by a function call with a `!` (i.e., `println!()`). Take for example, one of the necessary changes to allow creation of `Doc`s in a single pass was to replace HashMap fields with a simple type `KV`.

```rust
struct KV {
    key: String,
    value: String,
}
```

A very simple macro to create a `Vec<KV>`:

```rust
 macro_rules! map (
    { $($key:expr => $value:expr),+ } => {
        {
            let mut m = Vec::new();
            $(
                m.push(KV::new($key, $value));
            )+
            m
        }
    };
);
```

What we end up doing to parse the docstrings is use the `do_parse!()` macro returning a new `Doc`. For example, in order to parse `Doc.short`, we use a nom parsing chain of the following:

```rust
do_parse!(
        input,
        short:
            preceded!(
                take_until_and_consume!(delims.comm),
                take_until_and_consume!("\n")
            )
            >>
            // ...
            Doc {
                //..
            }
)
```

The `preceded!` macro takes into 2 values, returning the value of the second if the first is found prior. The `take_until_and_consume!` macro goes through every character in a string until the passed in value, returning the result eating the passed in value (removing it from the string but not returning it).

Similarly, in order to parse the parameters passed into a docstring, we use the following:

```rust
//--snip
par: opt!(many0!(complete!(map_res!(
                preceded!(
                    take_until_and_consume!(delims.params),
                    take_until_and_consume!("\n")
                ),
                as_kv
            ))))
            >>
//--snip
```

The `opt!` and `complete!` macros are used to signify that parameters are not required and it is possible that nothing follows. Additionally, `many0` does the inner actions until it fails and keeps it all in a list. The `map_res!` macro takes in 2 arguments, passing the first as parameters to the second and receiving the 2nd's resulting value.

This all occurs in a function `fn parse_doc<'a>(input: &'a str, delims: Delimiters) -> IResult<&'a str, Doc> {` which will return the newly generated Doc.

That's a long way of saying describing as we did before. For the short description and long description, take the entire line. For descriptors, parameters, and return values, take as many lines that contain that type and a keep a list of it's keys and values.

Similarly, the function to extract all of the potential docstrings from a file has been "nommed"

```rust
fn getinfo(input: &'static str, delims: Delimiters) -> IResult<&'static str, Vec<&'static str>> {
    many0!(
        input,
        complete!(preceded!(
            take_until_and_consume!(delims.start),
            take_until_and_consume!(delims.end)
        ))
    )
}
```

## Additional Changes

With the release of the 2018 Edition, I've migrated the project to match. Also, I ended up running in to a use case where temporarily overriding the delimiters via cli arguments was ideal and implemented the following function.

```rust
pub fn override_delims(overrides: String) -> Self {
    let mut result: Delimiters = Delimiters::default();
    let splitted: Vec<_> = Box::leak(overrides.into_boxed_str())
        .split_whitespace()
        .collect();
    if splitted.len() != 6 {
        panic!("Please enter the proper number of delimiters");
    }
    result.start = &splitted[0];
    result.end = &splitted[1];
    result.params = &splitted[2];
    result.ret = &splitted[3];
    result.opt = &splitted[4];
    result.comm = &splitted[5];
    result
}
```

## Conclusions

It took forever to figure out why parsing delimiters, descriptors, and return values was not working in nom. On and off about 2 weeks. It ended up being the ordering of nom functions to be called. In the end, I feel like I wrote clever code and I'm satisfied to consider this a completed project.
