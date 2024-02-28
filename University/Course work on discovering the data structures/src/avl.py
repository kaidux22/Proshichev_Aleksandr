class Node:
    def __init__(self, key, value):
        self.key = key
        self.value = value
        self.l_child = None
        self.r_child = None
        self.height = 1

class AVL:
    def __init__(self):
        self.root = None

    def get_height(self, node):
        if not node:
            return 0
        return node.height

    def max_height(self, node):
        left = self.get_height(node.l_child)
        right = self.get_height(node.r_child)
        return max(left, right)

    def sl_rotate(self, node):
        right_node = node.r_child
        right_left_node = right_node.l_child
        node.r_child = right_left_node
        right_node.l_child = node

        node.height = self.max_height(node) + 1
        right_node.height = self.max_height(right_node) + 1
        return right_node
    
    def sr_rotate(self, node):
        left_node = node.l_child
        left_right_node = left_node.r_child
        node.l_child = left_right_node
        left_node.r_child = node

        node.height = self.max_height(node) + 1
        left_node.height = self.max_height(left_node) + 1
        return left_node

    def br_rotate(self, node):
        node.l_child = self.sl_rotate(node.l_child)
        return self.sr_rotate(node)
        

    def bl_rotate(self, node):
        node.r_child = self.sr_rotate(node.r_child)
        return self.sl_rotate(node)


    def save_balance(self, local_root):
        if self.get_height(local_root.l_child) - self.get_height(local_root.r_child) == 2:
            left = local_root.l_child
            if self.get_height(left.r_child) <= self.get_height(left.l_child):
                return self.sr_rotate(local_root)
            else:
                return self.br_rotate(local_root)
        elif self.get_height(local_root.r_child) - self.get_height(local_root.l_child) == 2:
            right = local_root.r_child
            if self.get_height(right.l_child) <= self.get_height(right.r_child):
                return self.sl_rotate(local_root)
            else:
                return self.bl_rotate(local_root)
        return local_root

    def insert(self, key, value):
        self.root = self.find_place(Node(key, value), self.root)

    def find_place(self, node, root):
        if root == None:
            return node
        elif node.key > root.key:
            root.r_child = self.find_place(node, root.r_child)
        elif node.key == root.key:
            root.value = node.value
        else:
            root.l_child = self.find_place(node, root.l_child)

        root = self.save_balance(root)
        root.height = self.max_height(root) + 1
        return root

    def find(self, key, node):
        if node == None:
            return None
        elif key == node.key:
            return node.value
        elif key < node.key:
            return self.find(key, node.l_child)
        else:
            return self.find(key, node.r_child)

    def max(self, node):
        if node.r_child == None:
            return node
        return self.max(node.r_child)

    def min(self, node):
        if node.l_child == None:
            return node
        return self.min(node.l_child)

    def delete(self, key):
        self.root = self.remove(key, self.root)

    def remove(self, key, node):
        if node == None:
            return None
        elif key < node.key:
            node.l_child = self.remove(key, node.l_child)
        elif key > node.key:
            node.r_child = self.remove(key, node.r_child)
        else:
            if node.r_child == None:
                node = node.l_child
            else:
                mn = self.min(node.r_child)
                mn.r_child = self.remove(mn.key, node.r_child)
                mn.l_child = node.l_child
                node = mn
        if node != None:
            node.height = self.max_height(node) + 1
            node = self.save_balance(node)
        return node


    def print_info(self, node, height = 0):
        if height == 0 and node == None:
            print("Tree is empty")
        if node:
            self.print_info(node.r_child, height + 1)
            print('    ' * height + str(node.key) + " " + str(node.value))
            self.print_info(node.l_child, height + 1)