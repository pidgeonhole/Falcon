##### Question

Many countries has money in different denominations. For example, in Singapore, currencies come in
10c, 20c, 50c, $1, $2, $5, $10, $50, $100, $1000 and $10000. 

Your challenge is to find the number of ways to form **$x** using any number of the given denominations.

##### Instructions

For each test case, you will be provided with:
 1. an integer $x \geq 1$ which represents the currency target you are trying to achieve
    - i.e. $x = 200$ means we are asking how many ways are there to make 200 units 
 2. A sequence of integers separated by commas representing the different denomiations
    - i.e. 1, 5, 10, 20 means you must form 200 units with these denominations
    
Your task is to print the number of ways to achieve $x$.

```
Number of test cases
1
# Sample Input
200
1, 2, 5, 10, 20, 50, 100, 200
# Your output
73682
```

How you should output
```python 
number_of_test_cases = int(input())

for case_no in range(number_of_test_cases):
    target_number = int(input())
    strings_coins = input()   # output = "1,2,3,4,5,6"
    # coins is now a string, so to make it a list do the following
    coins = eval(coin)  # output = (1,2,3,4,5,6)
    
    # ... your function here 
    result = "Integer value of your result
    
    print("Case #{case_number}: {answer}".format(case_number=case_no, answer=result))
```
