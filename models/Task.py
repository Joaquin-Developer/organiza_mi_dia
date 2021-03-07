
class Task:

    def __init__(self, id_task, name, description, date_task, status):
        self.id_task = id_task
        self.name = name
        self.description = description
        self.date_task = date_task
        self.status = status

    def my_base(self):
        return "{}: {}, {}, {}, {}".format(self.id_task, self.name, self.description, self.date_task, self.status)

