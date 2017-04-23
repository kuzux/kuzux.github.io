---
layout: post
title: A Rant about Elm
comments: true
lang: en
---

First thing to note; I consider myself an Imperative programmer at heart, but also quite like Haskell (More about the super-expressive type system aspect than the functional purity aspect). Actually; quite recently I was thinking about how there is a need for a low-level language close to the metal with a Haskell-like type system, something like C with a nice type system on top (Not being really sure about the usefulness of that, just thought that that would be interesting); later noticed that I was describing something that was like Rust (So, consider me a Rust programmer at heart?).

So; recently I needed to do some frontend JS work, before that I was using React + Redux + whatever on browserland as I found the data model quite nice, than I stumbled onto Elm (I think I've heard that before this year, but had no idea what it was). And upon seeing it, I was pretty favorable to it; I mean it was pretty much slightly-different (with less features) Haskell on the frontend. Yeah, there is GHCJS already that compiles down to JavaScript but I liked Elm as it was both lightweight and pretty well-integrated into the JS platform (Getting Haskell to play well with the existing web technologies can sometimes be a real bitch). Plus, my already preferred data flow pattern (Redux) was inspired by it. What's there not to like about this thing? Turns out; a few.

First of all, the difficulty of interop with, well, anything. Ok, I get the no-runtime exceptions thing. It's a good thing whether you think deeply about it or not (or it's at least so when I think about it). But the system is already compromised with stuff like `Debug.crash` (and I think `Debug.Log` can crash if we give it some specifically crafted input). If we've already compromised the never-crash thing once, why can't we compromise that once more, and get some sort of `unsafe` block that lets us crash and burn everything if we want to?

The main use case of the unsafe block is interfacing with widely-known well tested JS libraries already existing in the wild. If we're going to make interfacing with existing JS libraries awkward (The pub-sub model is very clumsy on the JS side of things if we're not already dealing with a pub-sub system), then why does this thing exist on the JS-land after all? For example the first toy thing that I wanted to do with Elm, I thought it would look nice with Twitter Bootstrap (or insert any other UI/Layout framework here and there are no real comparable thing in Elm-land). Getting Bootstrap to work in an Elm application was an obvious ugly hack, and could have been avoided if only the language itself allowed loading a css file somewhere. And to come to think about it, I only loaded the css. If I wanted to load the JS and somehow interface with it, I would have to resort to another hack plus deal with the aforementioned pub-sub system.

The other use case is that Elm doesn't let us do many things that are expected from web applications. Using routing? thankfully elm-lang/navigation exists now so we don't have to deal with it using JS interop. Setting the page title? Yeah, write yourself a port and some JS code to actually read from the port to set the page title. Get a computed element size? Latch onto a mutable reference when you're on an event handler. There are tons-of JS-specific hacks around that don't necessarily translate to elm (at least not in a nice fashion).

Come to think of it, one of the purity guarantees is not used at all, and that is referential transparency. When we latch onto a mutable DOM reference in an event handler, we can write non-referentially transparent code with it and I think it just runs fine! (At least I couldn't crash it with not-intentionally-crashing code, didn't actually inspect how the compiler worked in that case). This means that the compiler doesn't use the fact that function is (at least it's supposed to be) referentially transparent when optimizing the code. Upon seeing that, I came to the realization that the compiler probably doesn't perform many of the optimizatoins I'm expecting from it given it's supposed to analyze purely functional code. The second implication is that latching onto a mutable reference, we can produce (at least intentionally) some crashing(ok, just weirdly-behaving i think) code within a supposedly no-crashes-at-runtime environment. 

<div class="floater">
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Haskell-Logo.svg/200px-Haskell-Logo.svg.png" />
    Haskell logo
</div>
Now we come to the big one. Lack of typeclasses. Seriously, that is a capital WHAT THE FUCK. I mean, typeclasses do not have to be explicitly within the language, but at least something analogous to it has to be. Yeah, we can technically emulate typeclasses by passing a map of methods as an extra argumet, but that's like claiming that C is object-oriented. That's pretty much like removing interfaces from Java or C# and putting nothing in to replace it. The fact that this decision is defended religiously by people claiming that 'it's too complicated' sounds extremely like Go and its generics (Let' not get into that argument, ever). I would understand that if we include structural typing with records and stuff as well as typeclasses the type inference can't work but I think it can (if we generate a typeclass for each field some record has, then we've gotten rid of the structural aspect of the type system). And even then if I had to choose two out of three between structural typing, typeclasses and type inference, i would choose the first two. 

Seriously, within the first hour (or maybe the second) of my dabbling in Elm, I came across a problem that made me wish that typeclasses existed. The fact that the language has a non-generic culture in the few libraries it has makes this even worse. Example here;

```
main = 
Navigation.program UrlChange
  { init          = init
  , view          = view |> Util.bootstrapped
  , update        = update
  , subscriptions = (\_ -> Sub.none)
  }
```
in that the function program has the type `(Location -> a) -> { ... init : Location -> (b, Cmd a) view  : b -> (Html a) ... }`. This simply doesn't work if we want to have multiple views composed into one that had different Message Types. Doesn't typecheck. If Elm typeclasses (or something that resembled them), the type would be `(Message a) => (Location -> s) -> { ... init : Location -> (b, Cmd a) view  : b -> (Html a) ... }` with an instance of Location on both types. Now, I have to  write a completely generic function with no constraints on type a for my view function, which doesn't typecheck. 

Some other user on the Elm subreddit complained that there is simply no way to enumerate union types, and that is also true without duplicating the constructors in a list. Current Solution:
```
type Foo = Bar | Baz
foos : List Foo
foos = [Bar, Baz]
```

proposed solution (with typeclasses):

```
type Foo = Bar | Baz deriving (Enum)

class Enum a where
   enumValues : Set a
```

Also, typeclasses already kind-of exist within elm, just not in a user-defined way. The mathematical operators have the type `number -> number -> number` and the comparison ones have `comparable -> comparable -> Bool` where `Int`s and `Float`s are `number`s and Ints, Floats, Strings, Lists and Tuples are `comparable` (go on and try running `"a"+"b"` or `{a = 3} < {a = 5}`). We can't add more types to those pre-defined type classes, those are in the language. Now, previously I've made the comparison to Go but this time it's more like Java and operator overloading. That thing is too complex, you can't use it except for the cases we've already decided. Seriously, being purely functional / having generics etc. at the same time as lacking typeclasses puts you in such a straightjacket that makes me want to rather write C# (no, not JS though, that's just too insane) or something. And one more thing, the `(==)` function has the type `a -> a -> Bool` and is defined once in the compiler. We can't override that behavior, no comments on that.

And their proposed/current solution? OCaml style overloading, i.e. Having the same functions with the same names defined in different modules. Honey, sorry to break it to you, but that's not a solution but rather a workaround.

After that, there are couple more features that I've missed but those are mostly cosmetic. First one is that there is no `hiding` in a module import, so I had to specify stuff like `Basics.max`. That can be fixed with specifying the stuff we want to import with the `exposing` keyword, that just wasn't comfortable for huge packages like `Html`. The other cosmetic change is that `let .. in` exists but `where` doesn't. `let x = f y in g x` is literally equivalent to `g x where x = f y`. And finally, unifying case statements with the function definitions. Assume `type Op = X | Y` and `f : Op -> Int`

```
f X = 3
f Y = 5
```
is literally equivalent to 
```
f op =
  case op of
    X -> 3
    Y -> 5
```

About those final points; if those extra features were grafted onto some imperative language, I would be fairly happy (but still very bitter about the lack of anything like typeclasses/interfaces). But this one with the look of Haskell, but lacking some nice features so that it feels like some kind of `Haskell--`. 
