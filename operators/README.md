# Operators
In certain situations, JavaScript coerces values. This means that values may implicitely be 
converted into a different type, without you saying to do so. Ideally, you would avoid this, as 
there is some performance hit as a product of this behavior, but also because it's much easier 
to understand what's going on when things are said explicitely.

This happens mostly with situations using operators. Operators are used for comparing or 
combining values in different ways. They look something like: `a + b` or `a == b`. They follow 
the pattern: `operand operator operand`. The operands can be any value, and the operator will be 
a symbol, or series of symbols.


## Comparison

### Equality (==, !=, ===, !==)
When comparing 2 values, the values on either side of the operator have to be made of the same 
type in order to evaluate whether the difference in value.
