class Cell:
    def __init__(self, key, value, type_cell):
        self.key = key
        self.value = value
        self.type = type_cell

    def __str__(self):
        return str(self.key) + " " + str(self.value)

class HashTable:
    def __init__(self, default_size):
        self.table = [Cell(None, None, False)] * default_size
        self.max_size = default_size
        self.size = 0

    def resize(self):
        self.size = 0
        used_table = self.table
        self.table = [Cell(None, None, False)] * self.max_size * 2
        self.max_size *= 2
        for idx in range(self.max_size // 2):
            if used_table[idx].type and used_table[idx].key != None:
                self.insert(used_table[idx].key, used_table[idx].value)
        

    def hash(self, num):
        return (num + 1) % self.max_size

    def linear_research(self, idx, i):
        return (idx + 7*i) % self.max_size

    def square_research(self, idx, i):
        return (idx + i*i) % self.max_size
    
    def double_hash_research(self, idx, i): 
        second_hash = (idx + 1) * 6577 % self.max_size
        return (self.hash(idx) % self.max_size + (i * second_hash) % self.max_size) % self.max_size
 
    def research(self, idx, i):
        return self.double_hash_research(idx, i)

    def insert(self, key, value):
        key_hash = self.hash(key)
        for i in range(self.size + 1):
            index = self.research(key_hash, i)
            if not self.table[index].type or self.table[index].key == None: 
                self.table[index] = Cell(key, value, True)
                self.size += 1
                break
            elif self.table[index].key == key:
                self.table[index].value = value
                break
        if self.size / self.max_size >= 2 / 3:
            self.resize()

    def find(self, key):
        key_hash = self.hash(key)
        for i in range(self.size + 1):
            index = self.research(key_hash, i)
            if not self.table[index].type:
                return None
            if self.table[index].type and self.table[index].key == key:
                return self.table[index].value

    def remove(self, key):
        key_hash = self.hash(key)
        for i in range(self.max_size):
            index = self.research(key_hash, i)
            if not self.table[index].type:
                break
            if self.table[index].type and self.table[index].key == key:
                self.table[index].key = None
                self.size -= 1
                break

    def print_info(self):
        for i in range(self.max_size):
            print(self.table[i])
        print()